import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ApiConcurrencyScenarioPage = lazy(() => import('./ApiConcurrencyScenarioPage'));

export const apiConcurrencyScenarioFeature: FeatureModule = {
  id: 'api-concurrency-scenario',
  title: '接口慢、并发多怎么处理',
  routePath: '/features/api-concurrency-scenario',
  category: 'scenario',
  tags: ['Scenario', 'API', 'Concurrency'],
  description: 'A practical scenario page covering slow APIs, concurrent requests, retries, deduplication, and resilience patterns.',
  EntryComponent: ApiConcurrencyScenarioPage,
};
