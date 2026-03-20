import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserUrlLifecyclePage = lazy(() => import('./BrowserUrlLifecyclePage'));

export const browserUrlLifecycleFeature: FeatureModule = {
  id: 'browser-url-lifecycle',
  title: '从输入 URL 到页面展示',
  routePath: '/features/browser-url-lifecycle',
  category: 'browser',
  tags: ['Browser', 'URL', 'Rendering'],
  description: 'A practical summary page covering what happens from entering a URL to the page being rendered.',
  EntryComponent: BrowserUrlLifecyclePage,
};
