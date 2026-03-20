import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ReactMechanismEffectLayoutPage = lazy(() => import('./ReactMechanismEffectLayoutPage'));

export const reactMechanismEffectLayoutFeature: FeatureModule = {
  id: 'react-mechanism-effect-vs-layout-effect',
  title: 'useEffect 与 useLayoutEffect 区别',
  routePath: '/features/react-mechanism-effect-vs-layout-effect',
  category: 'reactMechanism',
  navSection: 'React 机制类',
  tags: ['React', 'Effects', 'Layout'],
  description: 'A detailed React mechanism page covering the differences between useEffect and useLayoutEffect.',
  EntryComponent: ReactMechanismEffectLayoutPage,
};
