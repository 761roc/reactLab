import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TsTypeSystemConditionalMappedPage = lazy(() => import('./TsTypeSystemConditionalMappedPage'));

export const tsTypeSystemConditionalMappedFeature: FeatureModule = {
  id: 'ts-type-system-conditional-mapped',
  title: '条件类型和映射类型如何配合使用',
  routePath: '/features/ts-type-system-conditional-mapped',
  category: 'typescriptTypeSystemInterview',
  tags: ['TypeScript', 'Conditional Types', 'Mapped Types'],
  description: 'A detailed TypeScript type-system page covering how conditional and mapped types work together.',
  EntryComponent: TsTypeSystemConditionalMappedPage,
};
