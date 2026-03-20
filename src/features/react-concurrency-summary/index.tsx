import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactConcurrencySummaryPage = lazy(() => import('./ReactConcurrencySummaryPage'));

export const reactConcurrencySummaryFeature: FeatureModule = {
  id: 'react-concurrency-summary',
  title: 'React 18 并发特性',
  routePath: '/features/react-concurrency-summary',
  category: 'reactInterview',
  navSection: '渲染机制',
  tags: ['React', 'Concurrent', 'Transition'],
  description: 'A practical React interview page covering concurrent rendering, startTransition, deferred value, and user-perceived responsiveness.',
  EntryComponent: ReactConcurrencySummaryPage,
};
