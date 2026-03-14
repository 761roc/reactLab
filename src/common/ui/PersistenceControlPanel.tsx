import styles from './PersistenceControlPanel.module.css';

export interface PersistenceModeOption<TMode extends string> {
  value: TMode;
  label: string;
  description: string;
}

interface PersistenceControlPanelProps<TMode extends string> {
  title: string;
  subtitle: string;
  enabled: boolean;
  onToggle: (next: boolean) => void;
  mode: TMode;
  onModeChange: (next: TMode) => void;
  modeOptions: Array<PersistenceModeOption<TMode>>;
  ruleDescription: string;
  storageKeyLabel: string;
  onClear: () => void;
}

export function PersistenceControlPanel<TMode extends string>({
  title,
  subtitle,
  enabled,
  onToggle,
  mode,
  onModeChange,
  modeOptions,
  ruleDescription,
  storageKeyLabel,
  onClear
}: PersistenceControlPanelProps<TMode>) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelTitle}>{title}</p>
          <p className={styles.panelSubtitle}>{subtitle}</p>
        </div>

        <button
          className={`${styles.switch} ${enabled ? styles.switchOn : ''}`}
          onClick={() => onToggle(!enabled)}
          role="switch"
          aria-checked={enabled}
          type="button"
        >
          <span className={styles.switchThumb} />
          <span className={styles.switchText}>{enabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className={styles.modeGrid}>
        {modeOptions.map((option) => {
          const active = mode === option.value;
          return (
            <button
              key={option.value}
              className={`${styles.modeCard} ${active ? styles.modeCardActive : ''}`}
              disabled={!enabled}
              onClick={() => onModeChange(option.value)}
              type="button"
            >
              <span className={styles.modeLabel}>{option.label}</span>
              <span className={styles.modeDescription}>{option.description}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.footerRow}>
        <div>
          <p className={styles.hint}>{ruleDescription}</p>
          <p className={styles.hint}>Storage key: {storageKeyLabel}</p>
        </div>
        <button className={styles.clearButton} onClick={onClear} type="button">
          清空缓存
        </button>
      </div>
    </section>
  );
}
