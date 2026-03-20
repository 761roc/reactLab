import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringInterviewWhiteScreenPage = lazy(() => import('./EngineeringInterviewWhiteScreenPage'));

export const engineeringInterviewWhiteScreenFeature: FeatureModule = {
  id: 'engineering-interview-white-screen-analysis',
  title: '首屏白屏时间过长，你会怎么拆解问题',
  routePath: '/features/engineering-interview-white-screen-analysis',
  category: 'engineeringInterview',
  tags: ['Engineering', 'Performance', 'White Screen'],
  description: 'A detailed engineering interview page covering how to break down and diagnose long white-screen time.',
  EntryComponent: EngineeringInterviewWhiteScreenPage,
};
