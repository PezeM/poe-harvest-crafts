import { useDispatch, useSelector } from 'react-redux';
import { selectConfig, updateKey } from '../features/config/configSlice';
import { Button, DatePicker } from 'antd';
import React, { useEffect, useRef } from 'react';
import { mainProcess } from '../features/ipc/mainProcess';
import { desktopCapturer, SourcesOptions } from 'electron';
import appConfig from '../constants/appConfig';

interface CanvasProps {
  width: number;
  height: number;

  [propName: string]: any;
}

const Canvas: React.FC<CanvasProps> = ({
                                         width,
                                         height,
                                         ...props
                                       }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    context.fillStyle = '#333333';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }, []);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 100, 20, 0, 2 * Math.PI);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Our draw come here
    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} {...props} />;
};

export const Hello = () => {
  const dispatch = useDispatch();
  const config = useSelector(selectConfig);

  const takeScreenshot = async () => {
    console.log('Taking screenshot');

    const size = mainProcess.getScreenDimension();
    console.log(size);

    const options: SourcesOptions = {
      thumbnailSize: size,
      types: ['window', 'screen']
    };

    try {
      const sources = await desktopCapturer.getSources(options);
      for (const source of sources) {
        console.log(source);

        if (source.name !== appConfig.poeWindowName) continue;

        // const screenshotPath = path.join(os.tmpdir(), `${source.name}.png`);
        // console.log(screenshotPath);
        //
        // fs.writeFile(screenshotPath, source.thumbnail.toPNG(), err => {
        //   console.log(err);
        //   console.log('Saved file');
        // });
      }
    } catch (e) {
      console.error('Error in capturing image', e);
    }
  };

  return (
    <div>
      <DatePicker />
      <Button type='primary' style={{ marginLeft: 8 }}
              onClick={() => dispatch(updateKey({ key: 'logLevel', value: 'elo' }))}>
        Primary Button
        {config.logLevel}
      </Button>
      <div>
        co: {config.clientLog}
      </div>
      <Button type='primary' onClick={takeScreenshot}>
        Zrob se screena
      </Button>
      <Canvas width={1920} height={1080} />
      <Button type='primary' onClick={() => {
        const result = mainProcess.showOverlayWindow();
        console.log('window shown', result);
      }}>
        Open overlay
      </Button>
    </div>
  );
};
