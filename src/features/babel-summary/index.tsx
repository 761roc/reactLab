import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BabelSummaryPage = lazy(() => import('./BabelSummaryPage'));

export const babelSummaryFeature: FeatureModule = {
  id: 'babel-summary',
  title: 'Babel 做了什么',
  routePath: '/features/babel-summary',
  category: 'engineering',
  tags: ['Engineering', 'Compiler', 'Babel'],
  description: 'A practical summary page covering Babel parsing, transforming, polyfills, and common interview questions.',
  EntryComponent: BabelSummaryPage,
};
