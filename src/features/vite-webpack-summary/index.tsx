import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ViteWebpackSummaryPage = lazy(() => import('./ViteWebpackSummaryPage'));

export const viteWebpackSummaryFeature: FeatureModule = {
  id: 'vite-webpack-summary',
  title: 'Vite 和 Webpack 区别',
  routePath: '/features/vite-webpack-summary',
  category: 'engineering',
  tags: ['Engineering', 'Build', 'Vite'],
  description: 'A practical summary page covering Vite, Webpack, dev experience, bundling, and build tradeoffs.',
  EntryComponent: ViteWebpackSummaryPage,
};
