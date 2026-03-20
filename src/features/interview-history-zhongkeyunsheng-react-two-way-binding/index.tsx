import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengReactTwoWayBindingPage = lazy(() => import('./ZhongkeyunshengReactTwoWayBindingPage'));

export const interviewHistoryZhongkeyunshengTwoWayBindingFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-react-two-way-binding',
  title: 'React 如何实现双向绑定',
  routePath: '/features/interview-history-zhongkeyunsheng-react-two-way-binding',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'React', 'Forms'],
  description: 'A newspaper-style interview page covering how two-way binding is implemented in React.',
  EntryComponent: ZhongkeyunshengReactTwoWayBindingPage,
};
