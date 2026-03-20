import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserStorageSummaryPage = lazy(() => import('./BrowserStorageSummaryPage'));

export const browserStorageSummaryFeature: FeatureModule = {
  id: 'browser-storage-summary',
  title: '浏览器存储',
  routePath: '/features/browser-storage-summary',
  category: 'browser',
  tags: ['Browser', 'Storage', 'Cookie'],
  description: 'A practical summary page covering cookies, localStorage, sessionStorage, and IndexedDB.',
  EntryComponent: BrowserStorageSummaryPage,
};
