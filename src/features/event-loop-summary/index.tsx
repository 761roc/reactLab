import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EventLoopSummaryPage = lazy(() => import('./EventLoopSummaryPage'));

export const eventLoopSummaryFeature: FeatureModule = {
  id: 'event-loop-summary',
  title: '事件循环与异步',
  routePath: '/features/event-loop-summary',
  category: 'content',
  tags: ['Event Loop', 'Async', 'JavaScript'],
  description: 'A practical summary page covering the JavaScript event loop, microtasks, macrotasks, async/await, and common interview questions.',
  EntryComponent: EventLoopSummaryPage
};
