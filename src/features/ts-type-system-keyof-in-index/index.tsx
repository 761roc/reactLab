import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TsTypeSystemKeyofInIndexPage = lazy(() => import('./TsTypeSystemKeyofInIndexPage'));

export const tsTypeSystemKeyofInIndexFeature: FeatureModule = {
  id: 'ts-type-system-keyof-in-index',
  title: 'keyof、in、索引访问类型分别解决什么问题',
  routePath: '/features/ts-type-system-keyof-in-index',
  category: 'typescriptTypeSystemInterview',
  tags: ['TypeScript', 'Keyof', 'Mapped Types'],
  description: 'A detailed TypeScript type-system page covering keyof, in, and indexed access types.',
  EntryComponent: TsTypeSystemKeyofInIndexPage,
};
