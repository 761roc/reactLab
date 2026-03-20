import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactPerformanceSummaryPage = lazy(() => import('./ReactPerformanceSummaryPage'));

export const reactPerformanceSummaryFeature: FeatureModule = {
  id: 'react-performance-summary',
  title: '性能优化：memo、拆分、虚拟列表',
  routePath: '/features/react-performance-summary',
  category: 'reactInterview',
  navSection: '设计与性能',
  tags: ['React', 'Performance', 'Memo'],
  description: 'A practical React interview page covering memo, split boundaries, virtualization, and real-world optimization tradeoffs.',
  EntryComponent: ReactPerformanceSummaryPage,
};
