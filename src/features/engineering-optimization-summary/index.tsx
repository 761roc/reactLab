import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringOptimizationSummaryPage = lazy(() => import('./EngineeringOptimizationSummaryPage'));

export const engineeringOptimizationSummaryFeature: FeatureModule = {
  id: 'engineering-optimization-summary',
  title: '工程化优化专题',
  routePath: '/features/engineering-optimization-summary',
  category: 'engineering',
  tags: ['Engineering', 'Optimization', 'Performance'],
  description: 'A practical summary page covering code splitting, lazy loading, caching, build optimization, and engineering optimization strategies.',
  EntryComponent: EngineeringOptimizationSummaryPage,
};
