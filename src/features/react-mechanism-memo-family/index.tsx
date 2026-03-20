import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactMechanismMemoFamilyPage = lazy(() => import('./ReactMechanismMemoFamilyPage'));

export const reactMechanismMemoFamilyFeature: FeatureModule = {
  id: 'react-mechanism-memo-family',
  title: 'memo、useMemo、useCallback 分别解决什么',
  routePath: '/features/react-mechanism-memo-family',
  category: 'reactMechanism',
  navSection: 'React 机制类',
  tags: ['React', 'Memo', 'Performance'],
  description: 'A detailed React mechanism page covering what memo, useMemo, and useCallback each solve.',
  EntryComponent: ReactMechanismMemoFamilyPage,
};
