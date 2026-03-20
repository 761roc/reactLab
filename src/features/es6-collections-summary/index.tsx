import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const Es6CollectionsSummaryPage = lazy(() => import('./Es6CollectionsSummaryPage'));

export const es6CollectionsSummaryFeature: FeatureModule = {
  id: 'es6-collections-summary',
  title: 'ES6 集合类型',
  routePath: '/features/es6-collections-summary',
  category: 'content',
  tags: ['ES6', 'Map', 'Set'],
  description: 'A practical summary page covering Map, Set, WeakMap, WeakSet, and common interview questions around ES6 collections.',
  EntryComponent: Es6CollectionsSummaryPage
};
