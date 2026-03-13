import type { PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';
import { createValtioDemoStore, type ValtioDemoStore } from './valtio/createValtioDemoStore';

const ValtioDemoStoreContext = createContext<ValtioDemoStore | null>(null);

export function ValtioDemoProviders({ children }: PropsWithChildren) {
  const [store] = useState(() => createValtioDemoStore());

  return <ValtioDemoStoreContext.Provider value={store}>{children}</ValtioDemoStoreContext.Provider>;
}

export function useValtioDemoStore() {
  const store = useContext(ValtioDemoStoreContext);
  if (!store) {
    throw new Error('useValtioDemoStore must be used within ValtioDemoProviders');
  }

  return store;
}
