import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const BrowserJsInterviewPrototypePage = lazy(() => import('./BrowserJsInterviewPrototypePage'));

export const browserJsInterviewPrototypeFeature: FeatureModule = {
  id: 'browser-js-interview-prototype-inheritance-class',
  title: '原型链、继承、class 本质上是什么关系',
  routePath: '/features/browser-js-interview-prototype-inheritance-class',
  category: 'browserJsInterview',
  tags: ['JavaScript', 'Prototype', 'Class'],
  description: 'A detailed browser interview page covering the essence of prototype chains, inheritance, and class.',
  EntryComponent: BrowserJsInterviewPrototypePage,
};
