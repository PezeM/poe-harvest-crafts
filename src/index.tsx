import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { configuredStore } from './store';

const store = configuredStore();

render(
  <Provider store={store}>
    <App />,
  </Provider>,
  document.getElementById('root'));
