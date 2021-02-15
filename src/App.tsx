import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Button, DatePicker } from 'antd';
import './App.global.css';
import { BaseLayout } from './containers/baseLayout';

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

export default function App() {
  return (
    <Router>
      <BaseLayout>
        <Switch>
          <Route path='/' component={Hello} />
        </Switch>
      </BaseLayout>
    </Router>
  );
}
