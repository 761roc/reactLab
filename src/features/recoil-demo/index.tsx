import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { FeatureModule } from '../../core/feature-types';
import { RecoilDemoProviders } from './RecoilDemoProviders';

const RecoilDemoPage = lazy(() => import('./RecoilDemoPage'));

function withRecoilProviders(node: ReactElement) {
  return <RecoilDemoProviders>{node}</RecoilDemoProviders>;
}

export const recoilDemoFeature: FeatureModule = {
  id: 'recoil-demo',
  title: 'Recoil Demo',
  routePath: '/features/recoil-demo',
  tags: ['State', 'Recoil'],
  description: 'Feature-local Recoil atoms/selectors with block-based demos.',
  EntryComponent: RecoilDemoPage,
  withProviders: withRecoilProviders
};
