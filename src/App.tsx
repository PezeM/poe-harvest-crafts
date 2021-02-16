import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.global.css';
import { BaseLayout } from './containers/baseLayout';
import { ROUTES } from './constants/routes';
import { Error404 } from './components/error404';
import { Settings } from './components/Settings';
import { Hello } from './components/Hello';

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
