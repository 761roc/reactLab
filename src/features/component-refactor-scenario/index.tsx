import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ComponentRefactorScenarioPage = lazy(() => import('./ComponentRefactorScenarioPage'));

export const componentRefactorScenarioFeature: FeatureModule = {
  id: 'component-refactor-scenario',
  title: '一个组件越来越难维护，怎么重构',
  routePath: '/features/component-refactor-scenario',
  category: 'scenario',
  tags: ['Scenario', 'Refactor', 'Component'],
  description: 'A practical scenario page covering component refactoring, responsibility splitting, state extraction, and migration strategy.',
  EntryComponent: ComponentRefactorScenarioPage,
};
