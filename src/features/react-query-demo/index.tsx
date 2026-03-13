import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { FeatureModule } from '../../core/feature-types';
import { ReactQueryDemoProviders } from './ReactQueryDemoProviders';

const ReactQueryDemoPage = lazy(() => import('./ReactQueryDemoPage'));

function withReactQueryProviders(node: ReactElement) {
  return <ReactQueryDemoProviders>{node}</ReactQueryDemoProviders>;
}

export const reactQueryDemoFeature: FeatureModule = {
  id: 'react-query-demo',
  title: 'React Query Demo',
  routePath: '/features/react-query-demo',
  tags: ['Server State', 'React Query'],
  description: 'Scenario-driven React Query demos for remote data workflows.',
  EntryComponent: ReactQueryDemoPage,
  withProviders: withReactQueryProviders
};
