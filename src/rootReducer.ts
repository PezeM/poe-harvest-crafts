import { combineReducers } from 'redux';
import configReducer from './features/config/configSlice';

export default function createRootReducer() {
  return combineReducers({
    config: configReducer
  });
}
