import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringInterviewViteWebpackPage = lazy(() => import('./EngineeringInterviewViteWebpackPage'));

export const engineeringInterviewViteWebpackFeature: FeatureModule = {
  id: 'engineering-interview-vite-vs-webpack',
  title: 'Vite 和 Webpack 的核心差异与适用场景',
  routePath: '/features/engineering-interview-vite-vs-webpack',
  category: 'engineeringInterview',
  tags: ['Engineering', 'Build', 'Bundler'],
  description: 'A detailed engineering interview page covering the core differences between Vite and Webpack and when to use each.',
  EntryComponent: EngineeringInterviewViteWebpackPage,
};
