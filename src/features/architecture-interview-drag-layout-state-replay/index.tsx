import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ArchitectureInterviewDragLayoutStateReplayPage = lazy(
  () => import('./ArchitectureInterviewDragLayoutStateReplayPage'),
);

export const architectureInterviewDragLayoutStateReplayFeature: FeatureModule = {
  id: 'architecture-interview-drag-layout-state-replay',
  title: '如果让你设计一个拖拽编排页面，你会如何管理状态和回放',
  routePath: '/features/architecture-interview-drag-layout-state-replay',
  category: 'architectureInterview',
  tags: ['Architecture', 'Drag', 'State'],
  description: 'A detailed architecture interview page on drag-and-drop orchestration page state management and replay.',
  EntryComponent: ArchitectureInterviewDragLayoutStateReplayPage,
};
