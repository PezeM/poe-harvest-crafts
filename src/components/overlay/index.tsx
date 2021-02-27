import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './style.css';
import { mainProcess } from '../../features/ipc/mainProcess';
import { ImageDimension, IVector2 } from '../../types/vector.interface';
import { desktopCapturer, SourcesOptions } from 'electron';
import appConfig from '../../constants/appConfig';
import { ocrManager } from '../../features/ocr';
import { OcrProgressAction } from '../../types/overlay.interface';
import Title from 'antd/es/typography/Title';
import { IPC_EVENTS } from '../../constants/ipc/events';

export const OverlayContainer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<IVector2>({ x: 0, y: 0 });
  const [dragData, setDragData] = useState<IVector2>({ x: 0, y: 0 });
  const [actionData, setActionData] = useState<OcrProgressAction>({ progressText: 'SS', active: false });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // initialize the canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvasEle = canvasRef.current;

      canvasEle.width = canvasEle.clientWidth;
      canvasEle.height = canvasEle.clientHeight;
    }

    // Sends event that overlay is rendered and can be shown
    mainProcess.sendOverlayReady();
  }, []);

  useLayoutEffect(() => {
    function updateCanvasSize() {
      if (canvasRef.current) {
        const canvasEle = canvasRef.current;

        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;
      }
    }

    function onOcrProgressChange(data: any) {
      console.log(data);
    }

    window.addEventListener('resize', updateCanvasSize);
    mainProcess.addEventListener(IPC_EVENTS.OCR_PROGRESS, onOcrProgressChange);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      mainProcess.removeEventListener(IPC_EVENTS.OCR_PROGRESS, onOcrProgressChange);
    };
  }, []);

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!canvasRef.current || actionData.active) return;

    setIsDragging(true);

    // Save starting x/y coords
    const x = e.nativeEvent.offsetX - (canvasRef.current?.clientLeft ?? 0);
    const y = e.nativeEvent.offsetY - (canvasRef.current?.clientTop ?? 0);
    setDragStartPos({ x, y });
    setDragData({ x: 0, y: 0 });
    console.log(x, y);

    canvasRef.current.style.cursor = 'crosshair';
  }

  async function onMouseUp() {
    setIsDragging(false);
    if (actionData.active) return;

    console.log('onMouseUp', dragData);

    if (!canvasRef.current) return;
    canvasRef.current.style.cursor = 'default';

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Return when selected area is small
    if (Math.abs(dragData.x) < appConfig.minOcrWidth || Math.abs(dragData.y) < appConfig.minOcrHeight) {
      setActionData({ progressText: 'Selected area is too small.', active: false });
      console.warn(`Width / height of selected area is too small. height: ${Math.abs(dragData.y)} width: ${Math.abs(dragData.x)}`);
      setDragData({ x: 0, y: 0 });
      return;
    }

    await takeScreenshot();
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isDragging || !canvasRef.current || actionData.active) return;

    // Get current mouse position
    const x = e.nativeEvent.offsetX - canvasRef.current.clientLeft;
    const y = e.nativeEvent.offsetY - canvasRef.current.clientTop;

    // Calculate width/height based on current mouse pos vs starting mouse pos
    const width = x - dragStartPos.x;
    const height = y - dragStartPos.y;

    setDragData({
      x: width,
      y: height
    });

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      const borderWidth = 2;
      const offset = borderWidth * 2;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.lineWidth = borderWidth;

      ctx.strokeStyle = '#FFF';
      ctx.strokeRect(dragStartPos.x, dragStartPos.y, width, height);

      ctx.fillStyle = '#FFFFFF30';
      ctx.fillRect(dragStartPos.x - borderWidth, dragStartPos.y - borderWidth, width + offset, height + offset);
    }
  }

  async function takeScreenshot() {
    setActionData({ progressText: 'Taking screenshot', active: true });

    const size = canvasRef.current ? {
      height: canvasRef.current.height,
      width: canvasRef.current.width
    } : mainProcess.getScreenDimension();
    console.log(size);

    const options: SourcesOptions = {
      thumbnailSize: size,
      types: ['window']
    };

    // Just in case someone clicks on canvas after mouse up
    const imageDimension: ImageDimension = {
      x: dragStartPos.x,
      y: dragStartPos.y + 15, // +15 because of app bar height
      width: dragData.x,
      height: dragData.y
    };

    try {
      const sources = await desktopCapturer.getSources(options);
      console.log('Is poe', sources.some(s => s.name === appConfig.poeWindowName));

      const poeWindowSource = sources.find(s => s.name === appConfig.poeWindowName);
      if (!poeWindowSource) {
        setActionData({ progressText: 'PoE window not found', active: false });
        return;
      }

      await ocrManager.getTextFromImage(poeWindowSource.thumbnail, imageDimension, data => setActionData(data));
    } catch (e) {
      console.error('Error in capturing image', e);
      setActionData({ progressText: 'Error capturing image', active: false });
    }
  }

  return (
    <div className={styles.overlayContainer}>
      <canvas ref={canvasRef}
              className={styles.canvas}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove} />
      {actionData.progressText &&
      <div className={styles.progressContainer}>
        <Title level={1} style={{ margin: 0, userSelect: 'none' }}>
          {actionData.progressText}
        </Title>
      </div>
      }
    </div>
  );
};
