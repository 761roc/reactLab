import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ComponentLibraryScenarioPage = lazy(() => import('./ComponentLibraryScenarioPage'));

export const componentLibraryScenarioFeature: FeatureModule = {
  id: 'component-library-scenario',
  title: '如何设计一套可复用组件库',
  routePath: '/features/component-library-scenario',
  category: 'scenario',
  tags: ['Scenario', 'Design System', 'Component Library'],
  description: 'A practical scenario page covering component library design, API design, theming, accessibility, and rollout strategy.',
  EntryComponent: ComponentLibraryScenarioPage,
};
