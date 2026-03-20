import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactMechanismLargeListPage = lazy(() => import('./ReactMechanismLargeListPage'));

export const reactMechanismLargeListFeature: FeatureModule = {
  id: 'react-mechanism-large-list-optimization',
  title: 'React 大列表卡顿如何定位和优化',
  routePath: '/features/react-mechanism-large-list-optimization',
  category: 'reactMechanism',
  navSection: 'React 机制类',
  tags: ['React', 'List', 'Performance'],
  description: 'A detailed React mechanism page covering how to diagnose and optimize large list performance issues.',
  EntryComponent: ReactMechanismLargeListPage,
};
