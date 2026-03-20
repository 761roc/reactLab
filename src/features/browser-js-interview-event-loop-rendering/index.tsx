import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserJsInterviewEventLoopPage = lazy(() => import('./BrowserJsInterviewEventLoopPage'));

export const browserJsInterviewEventLoopFeature: FeatureModule = {
  id: 'browser-js-interview-event-loop-rendering',
  title: '宏任务和微任务如何影响页面渲染',
  routePath: '/features/browser-js-interview-event-loop-rendering',
  category: 'browserJsInterview',
  tags: ['Browser', 'Event Loop', 'Rendering'],
  description: 'A detailed browser interview page covering how macro tasks and micro tasks affect rendering.',
  EntryComponent: BrowserJsInterviewEventLoopPage,
};
