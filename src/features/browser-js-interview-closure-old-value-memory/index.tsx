import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserJsInterviewClosurePage = lazy(() => import('./BrowserJsInterviewClosurePage'));

export const browserJsInterviewClosureFeature: FeatureModule = {
  id: 'browser-js-interview-closure-old-value-memory',
  title: '闭包为什么会导致旧值或内存不释放',
  routePath: '/features/browser-js-interview-closure-old-value-memory',
  category: 'browserJsInterview',
  tags: ['JavaScript', 'Closure', 'Memory'],
  description: 'A detailed browser interview page covering why closures lead to stale values or retained memory.',
  EntryComponent: BrowserJsInterviewClosurePage,
};
