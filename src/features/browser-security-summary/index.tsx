import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserSecuritySummaryPage = lazy(() => import('./BrowserSecuritySummaryPage'));

export const browserSecuritySummaryFeature: FeatureModule = {
  id: 'browser-security-summary',
  title: '浏览器安全',
  routePath: '/features/browser-security-summary',
  category: 'browser',
  tags: ['Browser', 'Security', 'XSS'],
  description: 'A practical summary page covering XSS, CSRF, clickjacking, and common browser security interview questions.',
  EntryComponent: BrowserSecuritySummaryPage,
};
