import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const DesignPatternsPage = lazy(() => import('./DesignPatternsPage'));

export const designPatternsFeature: FeatureModule = {
  id: 'design-patterns',
  title: '设计模式',
  routePath: '/features/design-patterns',
  category: 'content',
  tags: ['Patterns', 'Frontend', 'Cases'],
  description: 'A curated frontend design patterns page with practical React-oriented use cases.',
  EntryComponent: DesignPatternsPage
};
