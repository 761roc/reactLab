import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserCrossOriginSummaryPage = lazy(() => import('./BrowserCrossOriginSummaryPage'));

export const browserCrossOriginSummaryFeature: FeatureModule = {
  id: 'browser-cross-origin-summary',
  title: '跨域',
  routePath: '/features/browser-cross-origin-summary',
  category: 'browser',
  tags: ['Browser', 'CORS', 'Proxy'],
  description: 'A practical summary page covering CORS, JSONP, proxies, and cross-origin interview questions.',
  EntryComponent: BrowserCrossOriginSummaryPage,
};
