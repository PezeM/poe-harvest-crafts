import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import createRootReducer from './rootReducer';

const rootReducer = createRootReducer();

export const configuredStore = () => {
  const store = configureStore({
    reducer: rootReducer
  });

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept(
      './rootReducer',
      () => store.replaceReducer(require('./rootReducer').default)
    );
  }

  return store;
};

export type RootState = ReturnType<typeof rootReducer>;
export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
