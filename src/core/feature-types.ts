import type { LazyExoticComponent, ReactElement } from 'react';

export interface FeatureModule {
  id: string;
  title: string;
  routePath: string;
  tags: string[];
  description: string;
  EntryComponent: LazyExoticComponent<() => ReactElement>;
  withProviders?: (node: ReactElement) => ReactElement;
}
