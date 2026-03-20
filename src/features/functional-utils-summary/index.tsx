import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const FunctionalUtilsSummaryPage = lazy(() => import('./FunctionalUtilsSummaryPage'));

export const functionalUtilsSummaryFeature: FeatureModule = {
  id: 'functional-utils-summary',
  title: '函数工具',
  routePath: '/features/functional-utils-summary',
  category: 'content',
  tags: ['Debounce', 'Throttle', 'Curry'],
  description: 'A practical summary page covering debounce, throttle, currying, partial application, and function composition.',
  EntryComponent: FunctionalUtilsSummaryPage
};
