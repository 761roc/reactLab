import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ModuleSystemSummaryPage = lazy(() => import('./ModuleSystemSummaryPage'));

export const moduleSystemSummaryFeature: FeatureModule = {
  id: 'module-system-summary',
  title: '模块化：ESM 与 CommonJS',
  routePath: '/features/module-system-summary',
  category: 'content',
  tags: ['ESM', 'CJS', 'Modules'],
  description: 'A practical summary page covering ESM, CommonJS, static analysis, live bindings, and common module-system interview questions.',
  EntryComponent: ModuleSystemSummaryPage
};
