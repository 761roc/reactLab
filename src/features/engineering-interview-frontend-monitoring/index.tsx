import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const EngineeringInterviewFrontendMonitoringPage = lazy(() => import('./EngineeringInterviewFrontendMonitoringPage'));

export const engineeringInterviewFrontendMonitoringFeature: FeatureModule = {
  id: 'engineering-interview-frontend-monitoring',
  title: '前端监控体系如何设计，指标、日志、告警如何分层',
  routePath: '/features/engineering-interview-frontend-monitoring',
  category: 'engineeringInterview',
  tags: ['Engineering', 'Monitoring', 'Observability'],
  description: 'A detailed engineering interview page covering frontend monitoring design, metrics, logs, and alerts.',
  EntryComponent: EngineeringInterviewFrontendMonitoringPage,
};
