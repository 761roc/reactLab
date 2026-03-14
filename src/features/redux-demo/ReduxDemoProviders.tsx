import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  REDUX_PERSIST_KEYS,
  REDUX_PERSIST_RULES,
  createReduxDemoStore,
  type PersistMode,
  type ReduxPersistenceOptions
} from './redux/store';

interface ReduxDemoPersistenceContextValue {
  enabled: boolean;
  mode: PersistMode;
  setEnabled: (value: boolean) => void;
  setMode: (mode: PersistMode) => void;
  clearPersistedState: () => void;
  ruleDescription: string;
  storageKey: string;
}

const ReduxDemoPersistenceContext = createContext<ReduxDemoPersistenceContextValue | null>(null);

function removePersistEntryByKey(key: string) {
  localStorage.removeItem(`persist:${key}`);
}

export function ReduxDemoProviders({ children }: PropsWithChildren) {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<PersistMode>('whitelist');

  const persistence = useMemo<ReduxPersistenceOptions>(
    () => ({
      enabled,
      mode
    }),
    [enabled, mode]
  );

  const bundle = useMemo(() => createReduxDemoStore(persistence), [persistence]);

  const clearPersistedState = useCallback(() => {
    bundle.persistor?.purge();
    removePersistEntryByKey(REDUX_PERSIST_KEYS.whitelist);
    removePersistEntryByKey(REDUX_PERSIST_KEYS.blacklist);
  }, [bundle.persistor]);

  const ruleDescription =
    mode === 'whitelist'
      ? `白名单：仅持久化 ${REDUX_PERSIST_RULES.whitelist.join(', ')}。`
      : `黑名单：排除 ${REDUX_PERSIST_RULES.blacklist.join(', ')}（其他 slice 持久化）。`;

  const value = useMemo<ReduxDemoPersistenceContextValue>(
    () => ({
      enabled,
      mode,
      setEnabled,
      setMode,
      clearPersistedState,
      ruleDescription,
      storageKey: REDUX_PERSIST_KEYS[mode]
    }),
    [clearPersistedState, enabled, mode, ruleDescription]
  );

  return (
    <ReduxDemoPersistenceContext.Provider value={value}>
      <Provider store={bundle.store}>
        {bundle.persistor ? <PersistGate loading={<p>Loading persisted state...</p>} persistor={bundle.persistor}>{children}</PersistGate> : children}
      </Provider>
    </ReduxDemoPersistenceContext.Provider>
  );
}

export function useReduxDemoPersistenceControls() {
  const value = useContext(ReduxDemoPersistenceContext);
  if (!value) {
    throw new Error('useReduxDemoPersistenceControls must be used within ReduxDemoProviders');
  }

  return value;
}
