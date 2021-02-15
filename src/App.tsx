import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Button, DatePicker } from 'antd';
import './App.global.css';
import { BaseLayout } from './containers/baseLayout';
import { ROUTES } from './constants/routes';

const Hello = () => {
  return (
    <div>
      <DatePicker />
      <Button type='primary' style={{ marginLeft: 8 }}>
        Primary Button
      </Button>
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
    <Router>
      <BaseLayout>
        <Switch>
          <Route path={ROUTES.MAIN} exact component={Hello} />
          <Route path={ROUTES.SETTINGS} component={Settings} />
        </Switch>
      </BaseLayout>
    </Router>
  );
}
