import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringInterviewTreeShakingPage = lazy(() => import('./EngineeringInterviewTreeShakingPage'));

export const engineeringInterviewTreeShakingFeature: FeatureModule = {
  id: 'engineering-interview-tree-shaking-failure',
  title: 'Tree Shaking 为什么会失效，如何排查',
  routePath: '/features/engineering-interview-tree-shaking-failure',
  category: 'engineeringInterview',
  tags: ['Engineering', 'Tree Shaking', 'Bundle'],
  description: 'A detailed engineering interview page covering why tree shaking fails and how to diagnose it.',
  EntryComponent: EngineeringInterviewTreeShakingPage,
};
