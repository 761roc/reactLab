import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengWebPerfAnalysisPage = lazy(() => import('./ZhongkeyunshengWebPerfAnalysisPage'));

export const interviewHistoryZhongkeyunshengWebPerfAnalysisFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-web-performance-analysis',
  title: 'Web 发布前后如何分析性能',
  routePath: '/features/interview-history-zhongkeyunsheng-web-performance-analysis',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'Performance', 'Web'],
  description: 'A newspaper-style interview page covering how to analyze web performance before and after release.',
  EntryComponent: ZhongkeyunshengWebPerfAnalysisPage,
};
