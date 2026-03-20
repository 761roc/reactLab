import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const VueCommonApiSummaryPage = lazy(() => import('./VueCommonApiSummaryPage'));

export const vueCommonApiSummaryFeature: FeatureModule = {
  id: 'vue-common-api-summary',
  title: 'Vue 常用 API',
  routePath: '/features/vue-common-api-summary',
  category: 'vueInterview',
  tags: ['Vue', 'API', 'Composition API'],
  description: 'A practical Vue interview page covering ref, reactive, computed, watch, props/emits, provide/inject, nextTick, and lifecycle APIs.',
  EntryComponent: VueCommonApiSummaryPage,
};
