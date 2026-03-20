import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactMechanismHooksTopLevelPage = lazy(() => import('./ReactMechanismHooksTopLevelPage'));

export const reactMechanismHooksTopLevelFeature: FeatureModule = {
  id: 'react-mechanism-hooks-top-level',
  title: 'Hooks 为什么只能在顶层调用',
  routePath: '/features/react-mechanism-hooks-top-level',
  category: 'reactMechanism',
  navSection: 'React 机制类',
  tags: ['React', 'Hooks', 'Rules'],
  description: 'A detailed React mechanism page covering why Hooks must be called at the top level.',
  EntryComponent: ReactMechanismHooksTopLevelPage,
};
