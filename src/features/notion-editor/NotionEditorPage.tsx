import { EditorContent, useEditor } from '@tiptap/react';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { useMemo, useState } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import { ImportExportBar } from './components/ImportExportBar';
import { InlineBubbleMenu } from './components/InlineBubbleMenu';
import { BlockquoteExit } from './extensions/blockquote-exit';
import { SlashCommand } from './extensions/slash-command';
import styles from './NotionEditorPage.module.css';

const initialDoc = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: '块编辑器实验（Tiptap）' }]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '支持使用 / 唤起命令菜单，选中文字可修改样式。支持 JSON 导入导出。'
        }
      ]
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '试试输入 / 查看更多功能' }] }]
        }
      ]
    }
  ]
};

export default function NotionEditorPage() {
  const [resetSeed, setResetSeed] = useState(0);
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          codeBlock: { HTMLAttributes: { spellcheck: 'false' } }
        }),
        Underline,
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Placeholder.configure({
          placeholder: '输入 / 唤起菜单…',
          showOnlyWhenEditable: true
        }),
        BlockquoteExit,
        SlashCommand
      ],
      editorProps: {
        attributes: {
          class: styles.prose
        }
      },
      content: initialDoc
    },
    [resetSeed]
  );

  const meta = useMemo(() => {
    if (!editor) {
      return { charCount: 0, blockCount: 0 };
    }

    const text = editor.getText();
    const json = editor.getJSON();
    const blockCount = Array.isArray(json.content) ? json.content.length : 0;

    return { charCount: text.length, blockCount };
  }, [editor, editor?.state.doc]);

  const handleReset = () => {
    if (editor) {
      editor.commands.setContent({ type: 'doc', content: [{ type: 'paragraph' }] });
      editor.commands.focus();
      return;
    }

    setResetSeed((prev) => prev + 1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>块编辑器（类 Notion/飞书）</h2>
          <p className={styles.subtitle}>
            当前文档：{meta.blockCount} blocks / {meta.charCount} chars
          </p>
        </div>
      </div>

      <SectionCard title="导入导出" note="File API + Clipboard，本地完成">
        <ImportExportBar editor={editor} onReset={handleReset} />
      </SectionCard>

      <div className={styles.editorContainer}>
        <div className={styles.editorShell}>
          {editor ? <InlineBubbleMenu editor={editor} /> : null}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
