import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ArchitectureInterviewMultiTeamGovernancePage = lazy(
  () => import('./ArchitectureInterviewMultiTeamGovernancePage'),
);

export const architectureInterviewMultiTeamGovernanceFeature: FeatureModule = {
  id: 'architecture-interview-multi-team-governance',
  title: '多团队协作开发一个前端平台时，如何保证规范统一',
  routePath: '/features/architecture-interview-multi-team-governance',
  category: 'architectureInterview',
  tags: ['Architecture', 'Governance', 'Team'],
  description: 'A detailed architecture interview page on multi-team frontend platform governance and standardization.',
  EntryComponent: ArchitectureInterviewMultiTeamGovernancePage,
};
