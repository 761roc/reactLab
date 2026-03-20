import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ArchitectureInterviewSsrCsrSsgSelectionPage = lazy(
  () => import('./ArchitectureInterviewSsrCsrSsgSelectionPage'),
);

export const architectureInterviewSsrCsrSsgSelectionFeature: FeatureModule = {
  id: 'architecture-interview-ssr-csr-ssg-selection',
  title: 'SSR、CSR、SSG 各自适合什么场景，怎么选',
  routePath: '/features/architecture-interview-ssr-csr-ssg-selection',
  category: 'architectureInterview',
  tags: ['Architecture', 'Rendering', 'SSR'],
  description: 'A detailed architecture interview page on choosing between SSR, CSR and SSG based on scenario.',
  EntryComponent: ArchitectureInterviewSsrCsrSsgSelectionPage,
};
