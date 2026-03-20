import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengUnionSafetyPage = lazy(() => import('./ZhongkeyunshengUnionSafetyPage'));

export const interviewHistoryZhongkeyunshengUnionSafetyFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-union-safety',
  title: 'type 做联合类型如何确保类型安全',
  routePath: '/features/interview-history-zhongkeyunsheng-union-safety',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'TypeScript', 'Union Types'],
  description: 'A newspaper-style interview page covering how to keep union types type-safe in TypeScript.',
  EntryComponent: ZhongkeyunshengUnionSafetyPage,
};
