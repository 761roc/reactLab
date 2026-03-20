import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserJsInterviewCorsPage = lazy(() => import('./BrowserJsInterviewCorsPage'));

export const browserJsInterviewCorsFeature: FeatureModule = {
  id: 'browser-js-interview-cross-origin-solutions',
  title: '跨域问题常见有哪些解法，各自边界是什么',
  routePath: '/features/browser-js-interview-cross-origin-solutions',
  category: 'browserJsInterview',
  tags: ['Browser', 'CORS', 'Security'],
  description: 'A detailed browser interview page covering common cross-origin solutions and their boundaries.',
  EntryComponent: BrowserJsInterviewCorsPage,
};
