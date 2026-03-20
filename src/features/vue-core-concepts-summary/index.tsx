import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const VueCoreConceptsSummaryPage = lazy(() => import('./VueCoreConceptsSummaryPage'));

export const vueCoreConceptsSummaryFeature: FeatureModule = {
  id: 'vue-core-concepts-summary',
  title: 'Vue 基础概念',
  routePath: '/features/vue-core-concepts-summary',
  category: 'vueInterview',
  tags: ['Vue', 'Concepts', 'Reactivity'],
  description: 'A practical Vue interview page covering core concepts, reactivity, SFCs, lifecycle, and composition mindset.',
  EntryComponent: VueCoreConceptsSummaryPage,
};
