import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserRenderingSummaryPage = lazy(() => import('./BrowserRenderingSummaryPage'));

export const browserRenderingSummaryFeature: FeatureModule = {
  id: 'browser-rendering-summary',
  title: '重排和重绘',
  routePath: '/features/browser-rendering-summary',
  category: 'browser',
  tags: ['Browser', 'Layout', 'Paint'],
  description: 'A practical summary page covering reflow, repaint, and rendering performance questions.',
  EntryComponent: BrowserRenderingSummaryPage,
};
