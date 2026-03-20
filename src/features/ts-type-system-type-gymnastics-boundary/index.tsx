import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TsTypeSystemTypeGymnasticsPage = lazy(() => import('./TsTypeSystemTypeGymnasticsPage'));

export const tsTypeSystemTypeGymnasticsFeature: FeatureModule = {
  id: 'ts-type-system-type-gymnastics-boundary',
  title: '类型体操在业务里应该用到什么程度，边界在哪里',
  routePath: '/features/ts-type-system-type-gymnastics-boundary',
  category: 'typescriptTypeSystemInterview',
  tags: ['TypeScript', 'Type Gymnastics', 'Engineering'],
  description: 'A detailed TypeScript type-system page covering the value and boundary of type gymnastics in business code.',
  EntryComponent: TsTypeSystemTypeGymnasticsPage,
};
