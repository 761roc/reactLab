import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const PrototypeChainSummaryPage = lazy(() => import('./PrototypeChainSummaryPage'));

export const prototypeChainSummaryFeature: FeatureModule = {
  id: 'prototype-chain-summary',
  title: '原型与原型链',
  routePath: '/features/prototype-chain-summary',
  category: 'content',
  tags: ['Prototype', 'Chain', 'JavaScript'],
  description: 'A practical summary page covering JavaScript prototype and prototype chain definitions, pitfalls, and interview-style questions.',
  EntryComponent: PrototypeChainSummaryPage
};
