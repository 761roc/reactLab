import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TypeScriptInterviewSummaryPage = lazy(() => import('./TypeScriptInterviewSummaryPage'));

export const typescriptInterviewSummaryFeature: FeatureModule = {
  id: 'typescript-interview-summary',
  title: 'TypeScript 常见题',
  routePath: '/features/typescript-interview-summary',
  category: 'engineering',
  tags: ['Engineering', 'TypeScript', 'Types'],
  description: 'A practical summary page covering generics, union types, type guards, infer, and TypeScript interview questions.',
  EntryComponent: TypeScriptInterviewSummaryPage,
};
