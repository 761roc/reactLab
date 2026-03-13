import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { FeatureModule } from '../../core/feature-types';
import { ValtioDemoProviders } from './ValtioDemoProviders';

const ValtioDemoPage = lazy(() => import('./ValtioDemoPage'));

function withValtioProviders(node: ReactElement) {
  return <ValtioDemoProviders>{node}</ValtioDemoProviders>;
}

export const valtioDemoFeature: FeatureModule = {
  id: 'valtio-demo',
  title: 'Valtio Demo',
  routePath: '/features/valtio-demo',
  tags: ['State', 'Valtio'],
  description: 'Feature-local Valtio proxy state with block-based demos.',
  EntryComponent: ValtioDemoPage,
  withProviders: withValtioProviders
};
