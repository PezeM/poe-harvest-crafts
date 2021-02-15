import { useDispatch, useSelector } from 'react-redux';
import { selectConfig, updateKey } from '../features/config/configSlice';
import { Button, DatePicker } from 'antd';
import React from 'react';

export const Hello = () => {
  const dispatch = useDispatch();
  const config = useSelector(selectConfig);

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
    </div>
  );
};
