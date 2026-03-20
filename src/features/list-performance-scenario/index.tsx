import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ListPerformanceScenarioPage = lazy(() => import('./ListPerformanceScenarioPage'));

export const listPerformanceScenarioFeature: FeatureModule = {
  id: 'list-performance-scenario',
  title: '大列表卡顿怎么优化',
  routePath: '/features/list-performance-scenario',
  category: 'scenario',
  tags: ['Scenario', 'Performance', 'List'],
  description: 'A practical scenario page covering large list jank, rendering bottlenecks, virtualization, and optimization tactics.',
  EntryComponent: ListPerformanceScenarioPage,
};
