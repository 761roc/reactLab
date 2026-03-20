import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const VueInterviewTopicsSummaryPage = lazy(() => import('./VueInterviewTopicsSummaryPage'));

export const vueInterviewTopicsSummaryFeature: FeatureModule = {
  id: 'vue-interview-topics-summary',
  title: 'Vue 常见面试考点解读',
  routePath: '/features/vue-interview-topics-summary',
  category: 'vueInterview',
  tags: ['Vue', 'Interview', 'Advanced'],
  description: 'A practical Vue interview page covering high-frequency interview topics like computed vs watch, v-if vs v-show, key, communication, and performance.',
  EntryComponent: VueInterviewTopicsSummaryPage,
};
