import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringInterviewCdnCacheVersioningPage = lazy(() => import('./EngineeringInterviewCdnCacheVersioningPage'));

export const engineeringInterviewCdnCacheVersioningFeature: FeatureModule = {
  id: 'engineering-interview-cdn-cache-versioning',
  title: 'CDN、缓存、版本号、资源指纹的作用',
  routePath: '/features/engineering-interview-cdn-cache-versioning',
  category: 'engineeringInterview',
  tags: ['Engineering', 'CDN', 'Cache'],
  description: 'A detailed engineering interview page covering the role of CDN, caching, versions, and asset fingerprints in release systems.',
  EntryComponent: EngineeringInterviewCdnCacheVersioningPage,
};
