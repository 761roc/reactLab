import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengMicroFrontendStylePage = lazy(() => import('./ZhongkeyunshengMicroFrontendStylePage'));

export const interviewHistoryZhongkeyunshengMicroFrontendStyleFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-micro-frontend-style-isolation',
  title: '微前端如何实现样式隔离',
  routePath: '/features/interview-history-zhongkeyunsheng-micro-frontend-style-isolation',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'Micro Frontend', 'CSS'],
  description: 'A newspaper-style interview page covering style isolation strategies in micro frontends.',
  EntryComponent: ZhongkeyunshengMicroFrontendStylePage,
};
