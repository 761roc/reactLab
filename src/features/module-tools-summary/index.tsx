import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ModuleToolsSummaryPage = lazy(() => import('./ModuleToolsSummaryPage'));

export const moduleToolsSummaryFeature: FeatureModule = {
  id: 'module-tools-summary',
  title: '模块化：ESM 和 CommonJS',
  routePath: '/features/module-tools-summary',
  category: 'engineering',
  tags: ['Engineering', 'Module', 'ESM'],
  description: 'A practical summary page covering ESM, CommonJS, static imports, live bindings, and interoperability.',
  EntryComponent: ModuleToolsSummaryPage,
};
