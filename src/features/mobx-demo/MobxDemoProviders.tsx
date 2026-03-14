import type { PropsWithChildren } from 'react';
import { autorun } from 'mobx';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  MOBX_PERSIST_KEYS,
  MOBX_PERSIST_RULES,
  MobxDemoStore,
  type MobxDemoSnapshot,
  type MobxPersistMode
} from './stores/MobxDemoStore';

const MobxDemoStoreContext = createContext<MobxDemoStore | null>(null);
const MobxPersistenceContext = createContext<MobxPersistenceContextValue | null>(null);

interface MobxPersistenceContextValue {
  enabled: boolean;
  mode: MobxPersistMode;
  setEnabled: (value: boolean) => void;
  setMode: (mode: MobxPersistMode) => void;
  clearPersistedState: () => void;
  ruleDescription: string;
  storageKey: string;
}

function readPersistedSnapshot(key: string): MobxDemoSnapshot | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return undefined;
    }
    return JSON.parse(raw) as MobxDemoSnapshot;
  } catch {
    return undefined;
  }
}

function buildSnapshotByMode(snapshot: MobxDemoSnapshot, mode: MobxPersistMode): MobxDemoSnapshot {
  if (mode === 'whitelist') {
    return {
      counter: snapshot.counter
    };
  }

  return {
    counter: snapshot.counter,
    todo: snapshot.todo
  };
}

function removePersistEntryByKey(key: string) {
  localStorage.removeItem(key);
}

function createStoreFromPersistence(enabled: boolean, mode: MobxPersistMode) {
  if (!enabled) {
    return new MobxDemoStore();
  }

  const key = MOBX_PERSIST_KEYS[mode];
  const persisted = readPersistedSnapshot(key);
  return new MobxDemoStore(persisted);
}

export function MobxDemoProviders({ children }: PropsWithChildren) {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<MobxPersistMode>('whitelist');

  const store = useMemo(() => createStoreFromPersistence(enabled, mode), [enabled, mode]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const key = MOBX_PERSIST_KEYS[mode];

    const disposer = autorun(() => {
      const snapshot = store.getSnapshot();
      const payload = buildSnapshotByMode(snapshot, mode);
      localStorage.setItem(key, JSON.stringify(payload));
    });

    return () => {
      disposer();
    };
  }, [enabled, mode, store]);

  const clearPersistedState = useCallback(() => {
    removePersistEntryByKey(MOBX_PERSIST_KEYS.whitelist);
    removePersistEntryByKey(MOBX_PERSIST_KEYS.blacklist);
  }, []);

  const ruleDescription =
    mode === 'whitelist'
      ? `白名单：仅持久化 ${MOBX_PERSIST_RULES.whitelist.join(', ')}。`
      : `黑名单：排除 ${MOBX_PERSIST_RULES.blacklist.join(', ')}（其他状态持久化）。`;

  const persistenceValue = useMemo<MobxPersistenceContextValue>(
    () => ({
      enabled,
      mode,
      setEnabled,
      setMode,
      clearPersistedState,
      ruleDescription,
      storageKey: MOBX_PERSIST_KEYS[mode]
    }),
    [clearPersistedState, enabled, mode, ruleDescription]
  );

  return (
    <MobxPersistenceContext.Provider value={persistenceValue}>
      <MobxDemoStoreContext.Provider value={store}>{children}</MobxDemoStoreContext.Provider>
    </MobxPersistenceContext.Provider>
  );
}

export function useMobxDemoStore() {
  const store = useContext(MobxDemoStoreContext);
  if (!store) {
    throw new Error('useMobxDemoStore must be used within MobxDemoProviders');
  }

  return store;
}

export function useMobxDemoPersistenceControls() {
  const value = useContext(MobxPersistenceContext);
  if (!value) {
    throw new Error('useMobxDemoPersistenceControls must be used within MobxDemoProviders');
  }

  return value;
}
