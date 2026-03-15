import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ResponsiveWebDemoPage = lazy(() => import('./ResponsiveWebDemoPage'));

export const responsiveWebDemoFeature: FeatureModule = {
  id: 'responsive-web-demo',
  title: 'Responsive Web Demo',
  routePath: '/features/responsive-web-demo',
  category: 'css',
  tags: ['Web', 'Responsive', 'Layout'],
  description: 'A long-form designed webpage covering real responsive adaptation challenges.',
  EntryComponent: ResponsiveWebDemoPage
};
