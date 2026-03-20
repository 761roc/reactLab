import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactMechanismDiffKeyPage = lazy(() => import('./ReactMechanismDiffKeyPage'));

export const reactMechanismDiffKeyFeature: FeatureModule = {
  id: 'react-mechanism-diff-key',
  title: 'React diff 的核心假设与 key',
  routePath: '/features/react-mechanism-diff-key',
  category: 'reactMechanism',
  navSection: 'React 机制类',
  tags: ['React', 'Diff', 'Key'],
  description: 'A detailed React mechanism page covering the diff assumptions and why keys matter.',
  EntryComponent: ReactMechanismDiffKeyPage,
};
