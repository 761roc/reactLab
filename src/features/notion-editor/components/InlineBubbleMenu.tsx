import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import styles from './InlineBubbleMenu.module.css';

interface InlineBubbleMenuProps {
  editor: Editor;
}

const textColors = [
  { label: '默认', value: null, color: 'var(--ne-text)' },
  { label: '蓝', value: '#3B82F6', color: '#3B82F6' },
  { label: '红', value: '#EF4444', color: '#EF4444' },
  { label: '绿', value: '#22C55E', color: '#22C55E' },
  { label: '橙', value: '#F59E0B', color: '#F59E0B' },
];

const highlightColors = [
  { label: '无', value: null, color: 'transparent', border: true },
  { label: '黄', value: '#FDE047', color: '#FDE047' },
  { label: '蓝', value: '#93C5FD', color: '#93C5FD' },
  { label: '绿', value: '#86EFAC', color: '#86EFAC' },
  { label: '粉', value: '#FBCFE8', color: '#FBCFE8' },
];

export function InlineBubbleMenu({ editor }: InlineBubbleMenuProps) {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 120, maxWidth: 600, placement: 'top' }}
    >
      <div className={styles.menu}>
        <div className={styles.group}>
          <button
            aria-label="Bold"
            aria-pressed={editor.isActive('bold')}
            className={styles.item}
            onClick={() => editor.chain().focus().toggleBold().run()}
            type="button"
          >
            B
          </button>
          <button
            aria-label="Italic"
            aria-pressed={editor.isActive('italic')}
            className={styles.item}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            type="button"
          >
            I
          </button>
          <button
            aria-label="Underline"
            aria-pressed={editor.isActive('underline')}
            className={styles.item}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            type="button"
          >
            U
          </button>
          <button
            aria-label="Strike"
            aria-pressed={editor.isActive('strike')}
            className={styles.item}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            type="button"
          >
            S
          </button>
          <button
            aria-label="Code"
            aria-pressed={editor.isActive('code')}
            className={styles.item}
            onClick={() => editor.chain().focus().toggleCode().run()}
            type="button"
          >
            {'</>'}
          </button>
        </div>

        <div className={styles.separator} />

        <div className={styles.group}>
          {textColors.map((item) => (
            <button
              aria-label={item.label}
              className={styles.colorItem}
              key={item.label}
              onClick={() =>
                item.value
                  ? editor.chain().focus().setColor(item.value).run()
                  : editor.chain().focus().unsetColor().run()
              }
              type="button"
            >
              <span className={styles.colorDot} style={{ background: item.color }} />
            </button>
          ))}
        </div>

        <div className={styles.separator} />

        <div className={styles.group}>
          {highlightColors.map((item) => (
            <button
              aria-label={item.label}
              className={styles.colorItem}
              key={item.label}
              onClick={() =>
                item.value
                  ? editor.chain().focus().setHighlight({ color: item.value }).run()
                  : editor.chain().focus().unsetHighlight().run()
              }
              type="button"
            >
              <span
                className={styles.highlightDot}
                style={{
                  background: item.color,
                  border: item.border ? '1px solid #ccc' : 'none',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </BubbleMenu>
  );
}
