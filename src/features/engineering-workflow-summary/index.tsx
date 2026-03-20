import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringWorkflowSummaryPage = lazy(() => import('./EngineeringWorkflowSummaryPage'));

export const engineeringWorkflowSummaryFeature: FeatureModule = {
  id: 'engineering-workflow-summary',
  title: 'CI/CD、代码规范、lint、测试',
  routePath: '/features/engineering-workflow-summary',
  category: 'engineering',
  tags: ['Engineering', 'CI/CD', 'Quality'],
  description: 'A practical summary page covering CI/CD, lint, testing, code standards, and engineering quality workflows.',
  EntryComponent: EngineeringWorkflowSummaryPage,
};
