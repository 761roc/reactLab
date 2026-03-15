import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactFlowDemoPage = lazy(() => import('./ReactFlowDemoPage'));

export const reactFlowDemoFeature: FeatureModule = {
  id: 'reactflow-demo',
  title: 'React Flow Demo',
  routePath: '/features/reactflow-demo',
  category: 'components',
  tags: ['Node Editor', 'ComfyUI-style'],
  description: 'A node-based workflow playground with multi-node graph orchestration patterns.',
  EntryComponent: ReactFlowDemoPage
};
