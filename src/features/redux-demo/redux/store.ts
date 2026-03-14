import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
  type Persistor
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { counterReducer } from './counterSlice';
import { preferencesReducer } from './preferencesSlice';
import { todoReducer } from './todoSlice';

export type PersistMode = 'whitelist' | 'blacklist';

export interface ReduxPersistenceOptions {
  enabled: boolean;
  mode: PersistMode;
}

export const REDUX_PERSIST_KEYS = {
  whitelist: 'redux-demo-whitelist',
  blacklist: 'redux-demo-blacklist'
} as const;

export const REDUX_PERSIST_RULES = {
  whitelist: ['counter'],
  blacklist: ['preferences']
} as const;

const rootReducer = combineReducers({
  counter: counterReducer,
  todo: todoReducer,
  preferences: preferencesReducer
});

export type RootState = ReturnType<typeof rootReducer>;

function buildPersistedReducer(mode: PersistMode) {
  return persistReducer(
    {
      key: REDUX_PERSIST_KEYS[mode],
      storage,
      whitelist: mode === 'whitelist' ? [...REDUX_PERSIST_RULES.whitelist] : undefined,
      blacklist: mode === 'blacklist' ? [...REDUX_PERSIST_RULES.blacklist] : undefined
    },
    rootReducer
  );
}

export function createReduxDemoStore(options: ReduxPersistenceOptions = { enabled: false, mode: 'whitelist' }) {
  const reducer = options.enabled ? buildPersistedReducer(options.mode) : rootReducer;

  const store = configureStore({
    reducer: reducer as typeof rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      })
  });

  const persistor: Persistor | null = options.enabled ? persistStore(store) : null;

  return {
    store,
    persistor,
    persistence: options
  };
}

export type ReduxDemoStore = ReturnType<typeof createReduxDemoStore>['store'];
export type AppDispatch = ReduxDemoStore['dispatch'];
