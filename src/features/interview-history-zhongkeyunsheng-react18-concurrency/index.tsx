import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengReact18ConcurrencyPage = lazy(() => import('./ZhongkeyunshengReact18ConcurrencyPage'));

export const interviewHistoryZhongkeyunshengReact18ConcurrencyFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-react18-concurrency',
  title: 'React18 中的并发如何实现',
  routePath: '/features/interview-history-zhongkeyunsheng-react18-concurrency',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'React', 'Concurrency'],
  description: 'A newspaper-style interview page covering how React 18 concurrency works internally.',
  EntryComponent: ZhongkeyunshengReact18ConcurrencyPage,
};
