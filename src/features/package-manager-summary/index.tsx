import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const PackageManagerSummaryPage = lazy(() => import('./PackageManagerSummaryPage'));

export const packageManagerSummaryFeature: FeatureModule = {
  id: 'package-manager-summary',
  title: '包管理：npm、yarn、pnpm',
  routePath: '/features/package-manager-summary',
  category: 'engineering',
  tags: ['Engineering', 'Package Manager', 'pnpm'],
  description: 'A practical summary page covering npm, yarn, pnpm, lockfiles, workspace support, and common package management questions.',
  EntryComponent: PackageManagerSummaryPage,
};
