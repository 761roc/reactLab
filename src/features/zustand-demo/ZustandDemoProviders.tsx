import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand';
import {
  ZUSTAND_PERSIST_KEYS,
  ZUSTAND_PERSIST_RULES,
  buildZustandSnapshotByMode,
  createZustandDemoStore,
  type PersistMode,
  type ZustandDemoSnapshot,
  type ZustandDemoState,
  type ZustandDemoStore
} from './stores/createZustandDemoStore';

const ZustandDemoStoreContext = createContext<ZustandDemoStore | null>(null);
const ZustandDemoPersistenceContext = createContext<ZustandPersistenceContextValue | null>(null);

interface ZustandPersistenceContextValue {
  enabled: boolean;
  mode: PersistMode;
  setEnabled: (value: boolean) => void;
  setMode: (mode: PersistMode) => void;
  clearPersistedState: () => void;
  ruleDescription: string;
  storageKey: string;
}

function readPersistedSnapshot(key: string): ZustandDemoSnapshot | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return undefined;
    }
    return JSON.parse(raw) as ZustandDemoSnapshot;
  } catch {
    return undefined;
  }
}

function createStoreFromPersistence(enabled: boolean, mode: PersistMode) {
  if (!enabled) {
    return createZustandDemoStore();
  }

  const key = ZUSTAND_PERSIST_KEYS[mode];
  const persisted = readPersistedSnapshot(key);
  return createZustandDemoStore(persisted);
}

export function ZustandDemoProviders({ children }: PropsWithChildren) {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<PersistMode>('whitelist');

  const store = useMemo(() => createStoreFromPersistence(enabled, mode), [enabled, mode]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const key = ZUSTAND_PERSIST_KEYS[mode];

    const unsub = store.subscribe((state) => {
      const payload = buildZustandSnapshotByMode(state, mode);
      localStorage.setItem(key, JSON.stringify(payload));
    });

    return () => {
      unsub();
    };
  }, [enabled, mode, store]);

  const clearPersistedState = useCallback(() => {
    localStorage.removeItem(ZUSTAND_PERSIST_KEYS.whitelist);
    localStorage.removeItem(ZUSTAND_PERSIST_KEYS.blacklist);
  }, []);

  const ruleDescription =
    mode === 'whitelist'
      ? `白名单：仅持久化 ${ZUSTAND_PERSIST_RULES.whitelist.join(', ')}。`
      : `黑名单：排除 ${ZUSTAND_PERSIST_RULES.blacklist.join(', ')}（其他状态持久化）。`;

  const persistenceValue = useMemo<ZustandPersistenceContextValue>(
    () => ({
      enabled,
      mode,
      setEnabled,
      setMode,
      clearPersistedState,
      ruleDescription,
      storageKey: ZUSTAND_PERSIST_KEYS[mode]
    }),
    [clearPersistedState, enabled, mode, ruleDescription]
  );

  return (
    <ZustandDemoPersistenceContext.Provider value={persistenceValue}>
      <ZustandDemoStoreContext.Provider value={store}>{children}</ZustandDemoStoreContext.Provider>
    </ZustandDemoPersistenceContext.Provider>
  );
}

export function useZustandDemoStore<T>(selector: (state: ZustandDemoState) => T): T {
  const store = useContext(ZustandDemoStoreContext);
  if (!store) {
    throw new Error('useZustandDemoStore must be used within ZustandDemoProviders');
  }

  return useStore(store, selector);
}

export function useZustandDemoPersistenceControls() {
  const value = useContext(ZustandDemoPersistenceContext);
  if (!value) {
    throw new Error('useZustandDemoPersistenceControls must be used within ZustandDemoProviders');
  }

  return value;
}
