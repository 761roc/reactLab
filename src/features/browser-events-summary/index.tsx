import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserEventsSummaryPage = lazy(() => import('./BrowserEventsSummaryPage'));

export const browserEventsSummaryFeature: FeatureModule = {
  id: 'browser-events-summary',
  title: '事件传播',
  routePath: '/features/browser-events-summary',
  category: 'browser',
  tags: ['Browser', 'Events', 'Delegate'],
  description: 'A practical summary page covering event capture, bubbling, and event delegation.',
  EntryComponent: BrowserEventsSummaryPage,
};
