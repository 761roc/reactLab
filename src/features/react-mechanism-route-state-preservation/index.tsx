import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactMechanismRouteStatePage = lazy(() => import('./ReactMechanismRouteStatePage'));

export const reactMechanismRouteStateFeature: FeatureModule = {
  id: 'react-mechanism-route-state-preservation',
  title: '路由切换时如何做状态保留与恢复',
  routePath: '/features/react-mechanism-route-state-preservation',
  category: 'reactMechanism',
  navSection: 'React 机制类',
  tags: ['React', 'Router', 'State'],
  description: 'A detailed React mechanism page covering strategies for preserving and restoring state across route changes.',
  EntryComponent: ReactMechanismRouteStatePage,
};
