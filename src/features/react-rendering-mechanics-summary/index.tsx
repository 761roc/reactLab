import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactRenderingMechanicsSummaryPage = lazy(() => import('./ReactRenderingMechanicsSummaryPage'));

export const reactRenderingMechanicsSummaryFeature: FeatureModule = {
  id: 'react-rendering-mechanics-summary',
  title: '渲染机制：key、渲染流程、批量更新',
  routePath: '/features/react-rendering-mechanics-summary',
  category: 'reactInterview',
  navSection: '渲染机制',
  tags: ['React', 'Rendering', 'Batching'],
  description: 'A practical React interview page covering key, reconciliation, render/commit flow, and batching updates.',
  EntryComponent: ReactRenderingMechanicsSummaryPage,
};
