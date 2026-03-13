import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { FeatureModule } from '../../core/feature-types';
import { JotaiDemoProviders } from './JotaiDemoProviders';

const JotaiDemoPage = lazy(() => import('./JotaiDemoPage'));

function withJotaiProviders(node: ReactElement) {
  return <JotaiDemoProviders>{node}</JotaiDemoProviders>;
}

export const jotaiDemoFeature: FeatureModule = {
  id: 'jotai-demo',
  title: 'Jotai Demo',
  routePath: '/features/jotai-demo',
  tags: ['State', 'Jotai'],
  description: 'Feature-local Jotai atoms with block-based learning demos.',
  EntryComponent: JotaiDemoPage,
  withProviders: withJotaiProviders
};
