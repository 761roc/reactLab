import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ShadcnDemoPage = lazy(() => import('./ShadcnDemoPage'));

export const shadcnDemoFeature: FeatureModule = {
  id: 'shadcn-demo',
  title: 'shadcn/ui Demo',
  routePath: '/features/shadcn-demo',
  category: 'components',
  tags: ['Dashboard', 'Registry', 'Long Page'],
  description: 'A long-form shadcn/ui-style workspace that combines many component primitives into one dense demo page.',
  EntryComponent: ShadcnDemoPage
};
