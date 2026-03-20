import type { LazyExoticComponent, ReactElement } from 'react';
import type { FeatureGuide } from './feature-guide-types';

export type FeatureCategory =
  | 'css'
  | 'react'
  | 'components'
  | 'content'
  | 'browser'
  | 'browserJsInterview'
  | 'architectureInterview'
  | 'engineering'
  | 'engineeringInterview'
  | 'scenario'
  | 'reactInterview'
  | 'reactMechanism'
  | 'typescriptTypeSystemInterview'
  | 'vueInterview'
  | 'interviewHistory';

export interface FeatureModule {
  id: string;
  title: string;
  routePath: string;
  category: FeatureCategory;
  navSection?: string;
  tags: string[];
  description: string;
  EntryComponent: LazyExoticComponent<() => ReactElement>;
  guide?: FeatureGuide;
  withProviders?: (node: ReactElement) => ReactElement;
}
