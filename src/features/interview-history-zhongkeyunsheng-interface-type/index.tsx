import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengInterfaceTypePage = lazy(() => import('./ZhongkeyunshengInterfaceTypePage'));

export const interviewHistoryZhongkeyunshengInterfaceTypeFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-interface-type',
  title: 'interface 和 type 的区别',
  routePath: '/features/interview-history-zhongkeyunsheng-interface-type',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'TypeScript', 'Types'],
  description: 'A newspaper-style interview page covering the practical difference between interface and type.',
  EntryComponent: ZhongkeyunshengInterfaceTypePage,
};
