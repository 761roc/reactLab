import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactCustomHookSummaryPage = lazy(() => import('./ReactCustomHookSummaryPage'));

export const reactCustomHookSummaryFeature: FeatureModule = {
  id: 'react-custom-hook-summary',
  title: '自定义 Hook 设计',
  routePath: '/features/react-custom-hook-summary',
  category: 'reactInterview',
  navSection: '设计与性能',
  tags: ['React', 'Hook', 'Abstraction'],
  description: 'A practical React interview page covering custom Hook design, API boundaries, responsibilities, and maintainable abstractions.',
  EntryComponent: ReactCustomHookSummaryPage,
};
