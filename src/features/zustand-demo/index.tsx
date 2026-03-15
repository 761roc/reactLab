import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { FeatureModule } from '../../core/feature-types';
import { ZustandDemoProviders } from './ZustandDemoProviders';

const ZustandDemoPage = lazy(() => import('./ZustandDemoPage'));

function withZustandProviders(node: ReactElement) {
  return <ZustandDemoProviders>{node}</ZustandDemoProviders>;
}

export const zustandDemoFeature: FeatureModule = {
  id: 'zustand-demo',
  title: 'Zustand Demo',
  routePath: '/features/zustand-demo',
  category: 'react',
  tags: ['State', 'Zustand'],
  description: 'Feature-local Zustand store with selector-driven UI blocks.',
  EntryComponent: ZustandDemoPage,
  withProviders: withZustandProviders
};
