import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TailwindDemoPage = lazy(() => import('./TailwindDemoPage'));

export const tailwindDemoFeature: FeatureModule = {
  id: 'tailwind-demo',
  title: 'Tailwind Demo',
  routePath: '/features/tailwind-demo',
  category: 'css',
  tags: ['CSS', 'Tailwind'],
  description: 'Utility-first styling examples with local page scope.',
  EntryComponent: TailwindDemoPage
};
