import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ExhibitionScreenDemoPage = lazy(() => import('./ExhibitionScreenDemoPage'));

export const exhibitionScreenDemoFeature: FeatureModule = {
  id: 'exhibition-screen-demo',
  title: 'Exhibition Screen Demo',
  routePath: '/features/exhibition-screen-demo',
  category: 'css',
  navSection: '展示大屏',
  tags: ['CSS', 'Dashboard', 'Exhibition'],
  description: 'A feature-local big-screen showroom dashboard with map flow, news, growth, and sales simulations.',
  EntryComponent: ExhibitionScreenDemoPage
};
