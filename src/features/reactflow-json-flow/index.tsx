import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactFlowJsonFlowPage = lazy(() => import('./ReactFlowJsonFlowPage'));

export const reactFlowJsonFlowFeature: FeatureModule = {
  id: 'reactflow-json-flow',
  title: 'React Flow JSON Workflow',
  routePath: '/features/reactflow-json-flow',
  category: 'components',
  tags: ['Workflow Engine', 'JSON Dataflow'],
  description: 'Executable local JSON workflow with validation, run logs, import/export, and persistence.',
  EntryComponent: ReactFlowJsonFlowPage
};
