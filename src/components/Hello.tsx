import { useDispatch, useSelector } from 'react-redux';
import { selectConfig, updateKey } from '../features/config/configSlice';
import { Button, DatePicker } from 'antd';
import React from 'react';
import { mainProcess } from '../features/ipc/mainProcess';
import { desktopCapturer, SourcesOptions } from 'electron';
import appConfig from '../constants/appConfig';

export const Hello = () => {
  const dispatch = useDispatch();
  const config = useSelector(selectConfig);

  const takeScreenshot = async () => {
    console.log('Taking screenshot');

    const size = mainProcess.getScreenDimension();
    console.log(size);


    const options: SourcesOptions = {
      thumbnailSize: size,
      types: ['window']
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
    </div>
  );
};
