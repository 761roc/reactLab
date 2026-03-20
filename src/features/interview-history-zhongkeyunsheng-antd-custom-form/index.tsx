import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const ZhongkeyunshengAntdCustomFormPage = lazy(() => import('./ZhongkeyunshengAntdCustomFormPage'));

export const interviewHistoryZhongkeyunshengAntdFormFeature: FeatureModule = {
  id: 'interview-history-zhongkeyunsheng-antd-custom-form',
  title: 'AntD 自定义表单如何设计',
  routePath: '/features/interview-history-zhongkeyunsheng-antd-custom-form',
  category: 'interviewHistory',
  navSection: '中科云声',
  tags: ['Interview', 'Ant Design', 'Forms'],
  description: 'A newspaper-style interview page covering custom form design based on Ant Design.',
  EntryComponent: ZhongkeyunshengAntdCustomFormPage,
};
