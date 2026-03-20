import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengUseStatePage = lazy(() => import('./ZhongkeyunshengUseStatePage'));

export const interviewHistoryZhongkeyunshengUseStateFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-usestate',
  title: 'React 中 useState 实现原理',
  routePath: '/features/interview-history-zhongkeyunsheng-usestate',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'React', 'Hooks'],
  description: 'A newspaper-style interview page covering the implementation model behind useState.',
  EntryComponent: ZhongkeyunshengUseStatePage,
};
