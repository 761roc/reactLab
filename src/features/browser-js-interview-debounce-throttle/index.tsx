import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserJsInterviewDebounceThrottlePage = lazy(() => import('./BrowserJsInterviewDebounceThrottlePage'));

export const browserJsInterviewDebounceThrottleFeature: FeatureModule = {
  id: 'browser-js-interview-debounce-throttle',
  title: '防抖和节流分别解决什么问题，底层思路是什么',
  routePath: '/features/browser-js-interview-debounce-throttle',
  category: 'browserJsInterview',
  tags: ['JavaScript', 'Debounce', 'Throttle'],
  description: 'A detailed browser interview page covering debounce and throttle, their problems, and implementation ideas.',
  EntryComponent: BrowserJsInterviewDebounceThrottlePage,
};
