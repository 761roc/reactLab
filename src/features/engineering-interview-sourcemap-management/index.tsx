import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringInterviewSourcemapManagementPage = lazy(() => import('./EngineeringInterviewSourcemapManagementPage'));

export const engineeringInterviewSourcemapManagementFeature: FeatureModule = {
  id: 'engineering-interview-sourcemap-management',
  title: '线上 sourcemap 如何管理，兼顾排错与安全',
  routePath: '/features/engineering-interview-sourcemap-management',
  category: 'engineeringInterview',
  tags: ['Engineering', 'Sourcemap', 'Security'],
  description: 'A detailed engineering interview page covering sourcemap management for debugging and security.',
  EntryComponent: EngineeringInterviewSourcemapManagementPage,
};
