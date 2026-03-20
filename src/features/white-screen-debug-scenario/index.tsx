import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const WhiteScreenDebugScenarioPage = lazy(() => import('./WhiteScreenDebugScenarioPage'));

export const whiteScreenDebugScenarioFeature: FeatureModule = {
  id: 'white-screen-debug-scenario',
  title: '页面白屏怎么排查',
  routePath: '/features/white-screen-debug-scenario',
  category: 'scenario',
  tags: ['Scenario', 'Debug', 'White Screen'],
  description: 'A practical scenario page covering white screen debugging, startup failures, resource errors, and diagnosis workflow.',
  EntryComponent: WhiteScreenDebugScenarioPage,
};
