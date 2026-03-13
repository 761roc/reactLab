import type { PropsWithChildren } from 'react';
import { Provider, createStore } from 'jotai';
import { useState } from 'react';

export function JotaiDemoProviders({ children }: PropsWithChildren) {
  const [store] = useState(() => createStore());

  return <Provider store={store}>{children}</Provider>;
}
