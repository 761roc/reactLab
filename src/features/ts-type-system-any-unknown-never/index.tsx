import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TsTypeSystemAnyUnknownNeverPage = lazy(() => import('./TsTypeSystemAnyUnknownNeverPage'));

export const tsTypeSystemAnyUnknownNeverFeature: FeatureModule = {
  id: 'ts-type-system-any-unknown-never',
  title: 'any、unknown、never 的区别和适用场景',
  routePath: '/features/ts-type-system-any-unknown-never',
  category: 'typescriptTypeSystemInterview',
  tags: ['TypeScript', 'Types', 'Interview'],
  description: 'A detailed TypeScript type-system page covering any, unknown, never and their practical boundaries.',
  EntryComponent: TsTypeSystemAnyUnknownNeverPage,
};
