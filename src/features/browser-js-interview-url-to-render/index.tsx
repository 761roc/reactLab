import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserJsInterviewUrlLifecyclePage = lazy(() => import('./BrowserJsInterviewUrlLifecyclePage'));

export const browserJsInterviewUrlLifecycleFeature: FeatureModule = {
  id: 'browser-js-interview-url-to-render',
  title: '浏览器输入 URL 到页面展示，中间发生了什么',
  routePath: '/features/browser-js-interview-url-to-render',
  category: 'browserJsInterview',
  tags: ['Browser', 'Networking', 'Rendering'],
  description: 'A detailed browser interview page covering the full lifecycle from entering a URL to rendering a page.',
  EntryComponent: BrowserJsInterviewUrlLifecyclePage,
};
