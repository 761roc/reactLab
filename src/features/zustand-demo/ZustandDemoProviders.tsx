import type { PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';
import { createZustandDemoStore, type ZustandDemoState, type ZustandDemoStore } from './stores/createZustandDemoStore';

const ZustandDemoStoreContext = createContext<ZustandDemoStore | null>(null);

export function ZustandDemoProviders({ children }: PropsWithChildren) {
  const [store] = useState(() => createZustandDemoStore());

  return <ZustandDemoStoreContext.Provider value={store}>{children}</ZustandDemoStoreContext.Provider>;
}

export function useZustandDemoStore<T>(selector: (state: ZustandDemoState) => T): T {
  const store = useContext(ZustandDemoStoreContext);
  if (!store) {
    throw new Error('useZustandDemoStore must be used within ZustandDemoProviders');
  }

  return useStore(store, selector);
}
