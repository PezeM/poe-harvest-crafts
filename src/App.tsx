import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Button, DatePicker } from 'antd';
import './App.global.css';
import { BaseLayout } from './containers/baseLayout';
import { ROUTES } from './constants/routes';
import { Error404 } from './components/error404';
import { useDispatch, useSelector } from 'react-redux';
import { selectConfig, updateKey } from './features/config/configSlice';

const Hello = () => {
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

const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <BaseLayout>
        <Switch>
          <Route path={ROUTES.MAIN} exact component={Hello} />
          <Route path={ROUTES.SETTINGS} component={Settings} />
          <Route path='*' component={Error404} />
        </Switch>
      </BaseLayout>
    </HashRouter>
  );
}
