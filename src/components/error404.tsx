import React from 'react';
import { Result } from 'antd';
import ButtonAntd from './buttonAntd';
import { ROUTES } from '../constants/routes';

export const Error404 = () => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <ButtonAntd to={ROUTES.MAIN} type='danger'>Back Main Page</ButtonAntd>
      }
    />
  );
};
