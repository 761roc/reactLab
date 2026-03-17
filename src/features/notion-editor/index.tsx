import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature-types';

const NotionEditorPage = lazy(() => import('./NotionEditorPage'));

export const notionEditorFeature: FeatureModule = {
  id: 'notion-editor',
  title: '块编辑器（类 Notion/飞书）',
  routePath: '/features/notion-editor',
  category: 'components',
  tags: ['Tiptap', 'Block', 'Import/Export'],
  description: '预设块、选区样式修改、文档导入导出。',
  EntryComponent: NotionEditorPage
};

