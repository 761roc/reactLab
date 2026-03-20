import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ArchitectureInterviewComplexAdminBoundariesPage = lazy(
  () => import('./ArchitectureInterviewComplexAdminBoundariesPage'),
);

export const architectureInterviewComplexAdminBoundariesFeature: FeatureModule = {
  id: 'architecture-interview-complex-admin-boundaries',
  title: '一个复杂后台页面，如何划分组件边界和状态边界',
  routePath: '/features/architecture-interview-complex-admin-boundaries',
  category: 'architectureInterview',
  tags: ['Architecture', 'Admin', 'State'],
  description: 'A detailed architecture interview page on component and state boundary design for complex admin pages.',
  EntryComponent: ArchitectureInterviewComplexAdminBoundariesPage,
};
