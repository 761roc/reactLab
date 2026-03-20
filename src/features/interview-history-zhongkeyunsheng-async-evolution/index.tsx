import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengAsyncEvolutionPage = lazy(() => import('./ZhongkeyunshengAsyncEvolutionPage'));

export const interviewHistoryZhongkeyunshengAsyncEvolutionFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-async-evolution',
  title: 'Callback 到 Async/Await 演进',
  routePath: '/features/interview-history-zhongkeyunsheng-async-evolution',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'JavaScript', 'Async'],
  description: 'A newspaper-style interview page covering the evolution from callbacks to async/await.',
  EntryComponent: ZhongkeyunshengAsyncEvolutionPage,
};
