import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringInterviewPerfRegressionPage = lazy(() => import('./EngineeringInterviewPerfRegressionPage'));

export const engineeringInterviewPerfRegressionFeature: FeatureModule = {
  id: 'engineering-interview-performance-regression-analysis',
  title: '页面突然变慢，如何做性能回归分析',
  routePath: '/features/engineering-interview-performance-regression-analysis',
  category: 'engineeringInterview',
  tags: ['Engineering', 'Performance', 'Regression'],
  description: 'A detailed engineering interview page covering how to run performance regression analysis when a page suddenly slows down.',
  EntryComponent: EngineeringInterviewPerfRegressionPage,
};
