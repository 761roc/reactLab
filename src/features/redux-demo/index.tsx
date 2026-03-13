import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { FeatureModule } from '../../core/feature-types';
import { ReduxDemoProviders } from './ReduxDemoProviders';

const ReduxDemoPage = lazy(() => import('./ReduxDemoPage'));

function withReduxProviders(node: ReactElement) {
  return <ReduxDemoProviders>{node}</ReduxDemoProviders>;
}

export const reduxDemoFeature: FeatureModule = {
  id: 'redux-demo',
  title: 'Redux Demo',
  routePath: '/features/redux-demo',
  tags: ['State', 'Redux Toolkit'],
  description: 'Feature-local Redux store and state updates.',
  EntryComponent: ReduxDemoPage,
  withProviders: withReduxProviders
};
