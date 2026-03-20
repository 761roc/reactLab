import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ArchitectureInterviewMicroFrontendCoreProblemsPage = lazy(
  () => import('./ArchitectureInterviewMicroFrontendCoreProblemsPage'),
);

export const architectureInterviewMicroFrontendCoreProblemsFeature: FeatureModule = {
  id: 'architecture-interview-micro-frontend-core-problems',
  title: '微前端除了样式隔离，还要解决哪些核心问题',
  routePath: '/features/architecture-interview-micro-frontend-core-problems',
  category: 'architectureInterview',
  tags: ['Architecture', 'Micro Frontend', 'Platform'],
  description: 'A detailed architecture interview page on the core problems micro frontends must solve beyond style isolation.',
  EntryComponent: ArchitectureInterviewMicroFrontendCoreProblemsPage,
};
