import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ClosureThisSummaryPage = lazy(() => import('./ClosureThisSummaryPage'));

export const closureThisSummaryFeature: FeatureModule = {
  id: 'closure-this-summary',
  title: '闭包与 this',
  routePath: '/features/closure-this-summary',
  category: 'content',
  tags: ['Closure', 'this', 'JavaScript'],
  description: 'A practical summary page covering common closure and this-binding pitfalls with answers, explanations, and code examples.',
  EntryComponent: ClosureThisSummaryPage
};
