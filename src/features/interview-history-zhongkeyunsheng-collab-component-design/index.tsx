import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengCollabDesignPage = lazy(() => import('./ZhongkeyunshengCollabDesignPage'));

export const interviewHistoryZhongkeyunshengCollabDesignFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-collab-component-design',
  title: '协同办公组件如何设计',
  routePath: '/features/interview-history-zhongkeyunsheng-collab-component-design',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'Collaboration', 'Architecture'],
  description: 'A newspaper-style interview page covering collaborative office component design.',
  EntryComponent: ZhongkeyunshengCollabDesignPage,
};
