import { lazy } from 'react';
import type { ReactElement } from 'react';
import type { FeatureModule } from '../../core/feature-types';
import { ReactContextDemoProviders } from './ReactContextDemoProviders';

const ReactContextDemoPage = lazy(() => import('./ReactContextDemoPage'));

function withReactContextProviders(node: ReactElement) {
  return <ReactContextDemoProviders>{node}</ReactContextDemoProviders>;
}

export const reactContextDemoFeature: FeatureModule = {
  id: 'react-context-demo',
  title: 'React Context Demo',
  routePath: '/features/react-context-demo',
  tags: ['State', 'React Context'],
  description: 'Feature-local React Context + useReducer state management demo blocks.',
  EntryComponent: ReactContextDemoPage,
  withProviders: withReactContextProviders
};
