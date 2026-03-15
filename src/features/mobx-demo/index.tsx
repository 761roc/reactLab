import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { FeatureModule } from '../../core/feature-types';
import { MobxDemoProviders } from './MobxDemoProviders';

const MobxDemoPage = lazy(() => import('./MobxDemoPage'));

function withMobxProviders(node: ReactElement) {
  return <MobxDemoProviders>{node}</MobxDemoProviders>;
}

export const mobxDemoFeature: FeatureModule = {
  id: 'mobx-demo',
  title: 'MobX Demo',
  routePath: '/features/mobx-demo',
  category: 'react',
  tags: ['State', 'MobX'],
  description: 'Feature-local MobX stores and reactive UI blocks.',
  EntryComponent: MobxDemoPage,
  withProviders: withMobxProviders
};
