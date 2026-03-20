import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengCrossPlatformPage = lazy(() => import('./ZhongkeyunshengCrossPlatformPage'));

export const interviewHistoryZhongkeyunshengCrossPlatformFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-cross-platform-evaluation',
  title: '跨端方案如何评估',
  routePath: '/features/interview-history-zhongkeyunsheng-cross-platform-evaluation',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'Cross Platform', 'Architecture'],
  description: 'A newspaper-style interview page covering how to evaluate cross-platform solutions.',
  EntryComponent: ZhongkeyunshengCrossPlatformPage,
};
