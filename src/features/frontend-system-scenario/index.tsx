import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const FrontendSystemScenarioPage = lazy(() => import('./FrontendSystemScenarioPage'));

export const frontendSystemScenarioFeature: FeatureModule = {
  id: 'frontend-system-scenario',
  title: '权限系统、路由守卫、埋点、国际化',
  routePath: '/features/frontend-system-scenario',
  category: 'scenario',
  tags: ['Scenario', 'Architecture', 'Permission'],
  description: 'A practical scenario page covering permissions, route guards, analytics tracking, and internationalization design.',
  EntryComponent: FrontendSystemScenarioPage,
};
