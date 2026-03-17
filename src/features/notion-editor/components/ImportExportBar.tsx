import type { JSONContent } from '@tiptap/core';
import type { Editor } from '@tiptap/react';
import type { ChangeEvent } from 'react';
import { useId, useMemo, useRef, useState } from 'react';
import styles from './ImportExportBar.module.css';
import { downloadTextFile, readFileAsText } from '../utils';

type ImportExportFormat = 'json';

interface ImportExportBarProps {
  editor: Editor | null;
  onReset: () => void;
}

export function ImportExportBar({ editor, onReset }: ImportExportBarProps) {
  const [status, setStatus] = useState<string | null>(null);
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canExport = Boolean(editor);

  const exportData = useMemo(() => {
    if (!editor) {
      return null;
    }

    return JSON.stringify(editor.getJSON(), null, 2);
  }, [editor]);

  const handleExport = (format: ImportExportFormat) => {
    if (!exportData) {
      return;
    }

    setStatus(null);

    if (format === 'json') {
      downloadTextFile(`notion-editor.${format}`, exportData, 'application/json');
      setStatus('已导出 JSON 文件');
    }
  };

  const handleCopy = async () => {
    if (!exportData) {
      return;
    }

    setStatus(null);

    try {
      await navigator.clipboard.writeText(exportData);
      setStatus('已复制 JSON 到剪贴板');
    } catch {
      setStatus('复制失败：请检查浏览器权限');
    }
  };

  const handleImportClick = () => {
    setStatus(null);
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !editor) {
      return;
    }

    setStatus(null);

    try {
      const text = await readFileAsText(file);
      const json = JSON.parse(text) as JSONContent;

      if (!json || typeof json !== 'object' || json.type !== 'doc') {
        throw new Error('Invalid doc');
      }

      editor.commands.setContent(json);
      setStatus('已导入并覆盖当前文档');
    } catch {
      setStatus('导入失败：文件不是有效的 Tiptap JSON');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.actions}>
        <button
          className={styles.primaryButton}
          disabled={!canExport}
          onClick={() => handleExport('json')}
          type="button"
        >
          导出 JSON
        </button>
        <button
          className={styles.button}
          disabled={!canExport}
          onClick={handleCopy}
          type="button"
        >
          复制 JSON
        </button>
        <button
          className={styles.button}
          disabled={!editor}
          onClick={handleImportClick}
          type="button"
        >
          导入 JSON
        </button>
        <button className={styles.dangerButton} onClick={onReset} type="button">
          清空
        </button>

        <label className={styles.fileLabel} htmlFor={inputId}>
          <input
            accept="application/json"
            id={inputId}
            onChange={handleImportFile}
            ref={fileInputRef}
            tabIndex={-1}
            type="file"
          />
        </label>
      </div>

      <div aria-live="polite" className={styles.status}>
        {status ? status : '导入导出仅在本地完成，不依赖后端。'}
      </div>
    </div>
  );
}
