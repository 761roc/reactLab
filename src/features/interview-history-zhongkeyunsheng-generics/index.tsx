import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengGenericsPage = lazy(() => import('./ZhongkeyunshengGenericsPage'));

export const interviewHistoryZhongkeyunshengGenericsFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-generics',
  title: '如何理解 TS 中的泛型',
  routePath: '/features/interview-history-zhongkeyunsheng-generics',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'TypeScript', 'Generics'],
  description: 'A newspaper-style interview page covering how to understand TypeScript generics and where they are used.',
  EntryComponent: ZhongkeyunshengGenericsPage,
};
