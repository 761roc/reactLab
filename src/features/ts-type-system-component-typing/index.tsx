import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const TsTypeSystemComponentTypingPage = lazy(() => import('./TsTypeSystemComponentTypingPage'));

export const tsTypeSystemComponentTypingFeature: FeatureModule = {
  id: 'ts-type-system-component-typing',
  title: '如何为一个组件设计类型，既好用又不容易误用',
  routePath: '/features/ts-type-system-component-typing',
  category: 'typescriptTypeSystemInterview',
  tags: ['TypeScript', 'Components', 'API Design'],
  description: 'A detailed TypeScript type-system page covering how to design ergonomic and safe component types.',
  EntryComponent: TsTypeSystemComponentTypingPage,
};
