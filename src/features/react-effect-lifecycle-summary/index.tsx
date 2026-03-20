import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactEffectLifecycleSummaryPage = lazy(() => import('./ReactEffectLifecycleSummaryPage'));

export const reactEffectLifecycleSummaryFeature: FeatureModule = {
  id: 'react-effect-lifecycle-summary',
  title: 'Effect 执行时机和清理逻辑',
  routePath: '/features/react-effect-lifecycle-summary',
  category: 'reactInterview',
  navSection: 'Hooks 与副作用',
  tags: ['React', 'Effect', 'Lifecycle'],
  description: 'A practical React interview page covering useEffect timing, cleanup, dependencies, and common side-effect pitfalls.',
  EntryComponent: ReactEffectLifecycleSummaryPage,
};
