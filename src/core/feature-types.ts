import type { LazyExoticComponent, ReactElement } from 'react';

export type FeatureCategory = 'css' | 'react';

export interface FeatureModule {
  id: string;
  title: string;
  routePath: string;
  category: FeatureCategory;
  tags: string[];
  description: string;
  EntryComponent: LazyExoticComponent<() => ReactElement>;
  withProviders?: (node: ReactElement) => ReactElement;
}
