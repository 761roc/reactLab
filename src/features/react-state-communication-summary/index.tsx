import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactStateCommunicationSummaryPage = lazy(() => import('./ReactStateCommunicationSummaryPage'));

export const reactStateCommunicationSummaryFeature: FeatureModule = {
  id: 'react-state-communication-summary',
  title: '状态与通信：受控/非受控、状态提升、Context',
  routePath: '/features/react-state-communication-summary',
  category: 'reactInterview',
  navSection: '状态与通信',
  tags: ['React', 'State', 'Context'],
  description: 'A practical React interview page covering controlled vs uncontrolled components, state lifting, context, and component communication.',
  EntryComponent: ReactStateCommunicationSummaryPage,
};
