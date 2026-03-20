import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ArchitectureInterviewComponentLibraryCapabilitiesPage = lazy(
  () => import('./ArchitectureInterviewComponentLibraryCapabilitiesPage'),
);

export const architectureInterviewComponentLibraryCapabilitiesFeature: FeatureModule = {
  id: 'architecture-interview-component-library-capabilities',
  title: '组件库如何设计主题能力、扩展能力和兼容升级能力',
  routePath: '/features/architecture-interview-component-library-capabilities',
  category: 'architectureInterview',
  tags: ['Architecture', 'Component Library', 'Design System'],
  description: 'A detailed architecture interview page on designing theme, extensibility, and compatibility in component libraries.',
  EntryComponent: ArchitectureInterviewComponentLibraryCapabilitiesPage,
};
