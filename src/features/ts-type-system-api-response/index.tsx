import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TsTypeSystemApiResponsePage = lazy(() => import('./TsTypeSystemApiResponsePage'));

export const tsTypeSystemApiResponseFeature: FeatureModule = {
  id: 'ts-type-system-api-response',
  title: '如何设计一套类型安全的接口返回结构',
  routePath: '/features/ts-type-system-api-response',
  category: 'typescriptTypeSystemInterview',
  tags: ['TypeScript', 'API', 'Design'],
  description: 'A detailed TypeScript type-system page covering how to design a type-safe API response structure.',
  EntryComponent: TsTypeSystemApiResponsePage,
};
