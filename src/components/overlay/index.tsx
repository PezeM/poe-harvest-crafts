import React, { useEffect, useRef, useState } from 'react';
import styles from './style.css';
import { mainProcess } from '../../features/ipc/mainProcess';
import { IVector2 } from '../../types/vector.interface';
import { desktopCapturer, SourcesOptions } from 'electron';
import appConfig from '../../constants/appConfig';
import * as os from 'os';
import path from 'path';
import * as fs from 'fs';

export const OverlayContainer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<IVector2>({ x: 0, y: 0 });
  const [dragData, setDragData] = useState<IVector2>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // initialize the canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvasEle = canvasRef.current;
      console.log(canvasEle);

      canvasEle.width = canvasEle.clientWidth;
      canvasEle.height = canvasEle.clientHeight;
    }

    // Sends event that overlay is rendered and can be shown
    mainProcess.sendOverlayReady();
  }, []);

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    setIsDragging(true);

    // Save starting x/y coords
    const x = e.nativeEvent.offsetX - (canvasRef.current?.clientLeft ?? 0);
    const y = e.nativeEvent.offsetY - (canvasRef.current?.clientTop ?? 0);
    setDragStartPos({ x, y });
    console.log(x, y);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'crosshair';
    }
  }

  async function onMouseUp() {
    setIsDragging(false);

    console.log('onMouseUp', dragData);

    if (!canvasRef.current) return;
    canvasRef.current.style.cursor = 'default';

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    await takeScreenshot();
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isDragging || !canvasRef.current) return;

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
    console.log('Taking screenshot');

    const size = mainProcess.getScreenDimension();
    console.log(size);

    const options: SourcesOptions = {
      thumbnailSize: size,
      types: ['window']
    };

    // Just in case someone clicks on canvas after mouse up
    const imageDimension = {
      x: dragStartPos.x,
      y: dragStartPos.y,
      width: dragData.x,
      height: dragData.y
    };

    try {
      const start = Date.now();
      const sources = await desktopCapturer.getSources(options);
      console.log('Is poe', sources.some(s => s.name === appConfig.poeWindowName));

      for (const source of sources) {
        if (source.name !== appConfig.poeWindowName) continue;

        const screenshotPath = path.join(os.tmpdir(), `${source.name}.png`);
        console.log(screenshotPath);

        const croppedImage = source.thumbnail.crop({
          height: imageDimension.height,
          width: imageDimension.width,
          x: imageDimension.x,
          y: imageDimension.y
        }).resize({
          height: 2000,
          width: 2000,
          quality: 'best'
        });

        fs.writeFile(screenshotPath, croppedImage.toPNG(), err => {
          console.log(err);
          console.log('Saved in', Date.now() - start);
        });
      }
    } catch (e) {
      console.error('Error in capturing image', e);
    }
  }

  return (
    <div className={styles.overlayContainer}>
      <canvas ref={canvasRef}
              className={styles.canvas}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove} />
    </div>
  );
};
