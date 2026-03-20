import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserCacheSummaryPage = lazy(() => import('./BrowserCacheSummaryPage'));

export const browserCacheSummaryFeature: FeatureModule = {
  id: 'browser-cache-summary',
  title: '浏览器缓存',
  routePath: '/features/browser-cache-summary',
  category: 'browser',
  tags: ['Browser', 'Cache', 'HTTP'],
  description: 'A practical summary page covering strong cache, negotiation cache, and common HTTP caching questions.',
  EntryComponent: BrowserCacheSummaryPage,
};
