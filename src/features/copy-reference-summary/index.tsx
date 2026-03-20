import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const CopyReferenceSummaryPage = lazy(() => import('./CopyReferenceSummaryPage'));

export const copyReferenceSummaryFeature: FeatureModule = {
  id: 'copy-reference-summary',
  title: '深拷贝、浅拷贝与引用传递',
  routePath: '/features/copy-reference-summary',
  category: 'content',
  tags: ['Copy', 'Reference', 'JavaScript'],
  description: 'A practical summary page covering shallow copy, deep copy, and pass-by-sharing questions with runnable code output.',
  EntryComponent: CopyReferenceSummaryPage
};
