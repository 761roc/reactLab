import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactCoreHooksSummaryPage = lazy(() => import('./ReactCoreHooksSummaryPage'));

export const reactCoreHooksSummaryFeature: FeatureModule = {
  id: 'react-core-hooks-summary',
  title: 'Hooks 基础：useState、useRef、useMemo、useCallback',
  routePath: '/features/react-core-hooks-summary',
  category: 'reactInterview',
  navSection: 'Hooks 与副作用',
  tags: ['React', 'Hooks', 'Memoization'],
  description: 'A practical React interview page covering useState, useRef, useMemo, and useCallback with real tradeoffs.',
  EntryComponent: ReactCoreHooksSummaryPage,
};
