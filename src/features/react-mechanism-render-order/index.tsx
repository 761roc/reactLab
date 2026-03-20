import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactMechanismRenderOrderPage = lazy(() => import('./ReactMechanismRenderOrderPage'));

export const reactMechanismRenderOrderFeature: FeatureModule = {
  id: 'react-mechanism-render-order',
  title: '父子渲染顺序与 effect 执行顺序',
  routePath: '/features/react-mechanism-render-order',
  category: 'reactMechanism',
  navSection: 'React 机制类',
  tags: ['React', 'Render', 'Effects'],
  description: 'A detailed React mechanism page covering parent-child render order and effect execution order.',
  EntryComponent: ReactMechanismRenderOrderPage,
};
