import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ArchitectureInterviewLowCodeFormPlatformPage = lazy(
  () => import('./ArchitectureInterviewLowCodeFormPlatformPage'),
);

export const architectureInterviewLowCodeFormPlatformFeature: FeatureModule = {
  id: 'architecture-interview-low-code-form-platform',
  title: '如果让你设计一个低代码表单平台，你会怎么拆模块',
  routePath: '/features/architecture-interview-low-code-form-platform',
  category: 'architectureInterview',
  tags: ['Architecture', 'Low Code', 'Form'],
  description: 'A detailed architecture interview page on how to split modules when designing a low-code form platform.',
  EntryComponent: ArchitectureInterviewLowCodeFormPlatformPage,
};
