import type { PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';
import { MobxDemoStore } from './stores/MobxDemoStore';

const MobxDemoStoreContext = createContext<MobxDemoStore | null>(null);

export function MobxDemoProviders({ children }: PropsWithChildren) {
  const [store] = useState(() => new MobxDemoStore());

  return <MobxDemoStoreContext.Provider value={store}>{children}</MobxDemoStoreContext.Provider>;
}

export function useMobxDemoStore() {
  const store = useContext(MobxDemoStoreContext);
  if (!store) {
    throw new Error('useMobxDemoStore must be used within MobxDemoProviders');
  }

  return store;
}
