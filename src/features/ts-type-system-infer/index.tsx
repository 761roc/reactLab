import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TsTypeSystemInferPage = lazy(() => import('./TsTypeSystemInferPage'));

export const tsTypeSystemInferFeature: FeatureModule = {
  id: 'ts-type-system-infer',
  title: 'infer 是怎么理解的，常见用在哪些工具类型里',
  routePath: '/features/ts-type-system-infer',
  category: 'typescriptTypeSystemInterview',
  tags: ['TypeScript', 'Infer', 'Utility Types'],
  description: 'A detailed TypeScript type-system page covering how to understand infer and where it appears in utility types.',
  EntryComponent: TsTypeSystemInferPage,
};
