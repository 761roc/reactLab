import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengStateSchemesPage = lazy(() => import('./ZhongkeyunshengStateSchemesPage'));

export const interviewHistoryZhongkeyunshengStateSchemeFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-global-state-schemes',
  title: 'React 全局状态方案如何选',
  routePath: '/features/interview-history-zhongkeyunsheng-global-state-schemes',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'React', 'State'],
  description: 'A newspaper-style interview page comparing global state solutions in React.',
  EntryComponent: ZhongkeyunshengStateSchemesPage,
};
