import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactMechanismSetStateFlowPage = lazy(() => import('./ReactMechanismSetStateFlowPage'));

export const reactMechanismSetStateFlowFeature: FeatureModule = {
  id: 'react-mechanism-setstate-flow',
  title: '一次 setState 到页面更新经历了什么',
  routePath: '/features/react-mechanism-setstate-flow',
  category: 'reactMechanism',
  navSection: 'React 机制类',
  tags: ['React', 'Fiber', 'Update'],
  description: 'A detailed React mechanism page covering the full path from setState to DOM commit.',
  EntryComponent: ReactMechanismSetStateFlowPage,
};
