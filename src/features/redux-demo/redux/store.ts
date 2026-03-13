import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './counterSlice';
import { preferencesReducer } from './preferencesSlice';
import { todoReducer } from './todoSlice';

export function createReduxDemoStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      todo: todoReducer,
      preferences: preferencesReducer
    }
  });
}

export type ReduxDemoStore = ReturnType<typeof createReduxDemoStore>;
export type RootState = ReturnType<ReduxDemoStore['getState']>;
export type AppDispatch = ReduxDemoStore['dispatch'];
