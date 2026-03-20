import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TreeShakingSummaryPage = lazy(() => import('./TreeShakingSummaryPage'));

export const treeShakingSummaryFeature: FeatureModule = {
  id: 'tree-shaking-summary',
  title: 'Tree Shaking 原理',
  routePath: '/features/tree-shaking-summary',
  category: 'engineering',
  tags: ['Engineering', 'Bundle', 'Tree Shaking'],
  description: 'A practical summary page covering tree shaking, static analysis, side effects, and common bundling questions.',
  EntryComponent: TreeShakingSummaryPage,
};
