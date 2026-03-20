import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserJsInterviewCachePage = lazy(() => import('./BrowserJsInterviewCachePage'));

export const browserJsInterviewCacheFeature: FeatureModule = {
  id: 'browser-js-interview-browser-cache',
  title: '浏览器缓存、协商缓存、强缓存分别怎么工作',
  routePath: '/features/browser-js-interview-browser-cache',
  category: 'browserJsInterview',
  tags: ['Browser', 'Cache', 'HTTP'],
  description: 'A detailed browser interview page covering strong cache, negotiated cache, and browser caching behavior.',
  EntryComponent: BrowserJsInterviewCachePage,
};
