import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { createReduxDemoStore } from './redux/store';

export function ReduxDemoProviders({ children }: PropsWithChildren) {
  const store = useMemo(() => createReduxDemoStore(), []);
  return <Provider store={store}>{children}</Provider>;
}
