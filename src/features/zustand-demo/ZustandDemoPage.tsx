import { useState } from 'react';
import { PersistenceControlPanel, type PersistenceModeOption } from '../../common/ui/PersistenceControlPanel';
import { SectionCard } from '../../common/ui/SectionCard';
import { useZustandDemoPersistenceControls, useZustandDemoStore } from './ZustandDemoProviders';
import type { PersistMode } from './stores/createZustandDemoStore';
import styles from './ZustandDemoPage.module.css';

const persistModeOptions: Array<PersistenceModeOption<PersistMode>> = [
  {
    value: 'whitelist',
    label: '白名单模式',
    description: '仅保存 count，用于最小持久化演示。'
  },
  {
    value: 'blacklist',
    label: '黑名单模式',
    description: '排除 theme/density/showHints，其它状态保留。'
  }
];

export default function ZustandDemoPage() {
  const [draft, setDraft] = useState('');
  const { enabled, mode, setEnabled, setMode, clearPersistedState, ruleDescription, storageKey } = useZustandDemoPersistenceControls();

  const count = useZustandDemoStore((state) => state.count);
  const increment = useZustandDemoStore((state) => state.increment);
  const decrement = useZustandDemoStore((state) => state.decrement);
  const resetCount = useZustandDemoStore((state) => state.resetCount);

  const todoFilter = useZustandDemoStore((state) => state.todoFilter);
  const addTodo = useZustandDemoStore((state) => state.addTodo);
  const toggleTodo = useZustandDemoStore((state) => state.toggleTodo);
  const removeTodo = useZustandDemoStore((state) => state.removeTodo);
  const setTodoFilter = useZustandDemoStore((state) => state.setTodoFilter);
  const clearCompleted = useZustandDemoStore((state) => state.clearCompleted);

  const theme = useZustandDemoStore((state) => state.theme);
  const density = useZustandDemoStore((state) => state.density);
  const showHints = useZustandDemoStore((state) => state.showHints);
  const setTheme = useZustandDemoStore((state) => state.setTheme);
  const cycleDensity = useZustandDemoStore((state) => state.cycleDensity);
  const toggleHints = useZustandDemoStore((state) => state.toggleHints);

  const runCombinedReset = useZustandDemoStore((state) => state.runCombinedReset);

  const visibleTodos = useZustandDemoStore((state) => {
    if (state.todoFilter === 'active') {
      return state.todoItems.filter((item) => !item.done);
    }
    if (state.todoFilter === 'done') {
      return state.todoItems.filter((item) => item.done);
    }
    return state.todoItems;
  });

  const pendingCount = useZustandDemoStore((state) => state.todoItems.filter((item) => !item.done).length);

  return (
    <div className={styles.wrapper}>
      <header className={styles.headerRow}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>Zustand playground</h2>
          <p className={styles.note}>Zustand store lives only in this feature via withProviders().</p>
        </div>

        <PersistenceControlPanel
          enabled={enabled}
          mode={mode}
          modeOptions={persistModeOptions}
          onClear={clearPersistedState}
          onModeChange={setMode}
          onToggle={setEnabled}
          ruleDescription={ruleDescription}
          storageKeyLabel={enabled ? storageKey : 'disabled'}
          subtitle="切换策略后刷新页面，观察 Zustand 状态保留差异"
          title="Zustand 持久化演示"
        />
      </header>

      <SectionCard note="用意：演示 createStore + selector 的基础状态读写。" title="块 1：Counter State（基础状态管理）">
        <div className={styles.counterPanel}>
          <p className={styles.counterValue}>{count}</p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={decrement} type="button">
              -1
            </button>
            <button className={styles.button} onClick={increment} type="button">
              +1
            </button>
            <button className={styles.buttonGhost} onClick={resetCount} type="button">
              reset
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示列表状态、过滤切换和增删改流程。" title="块 2：Todo State（列表与过滤）">
        <div className={styles.todoControls}>
          <input
            className={styles.todoInput}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="输入任务后点击 Add"
            type="text"
            value={draft}
          />
          <button
            className={styles.button}
            onClick={() => {
              addTodo(draft);
              setDraft('');
            }}
            type="button"
          >
            Add
          </button>
          <button className={styles.buttonGhost} onClick={clearCompleted} type="button">
            Clear done
          </button>
        </div>

        <div className={styles.filters}>
          {(['all', 'active', 'done'] as const).map((filter) => (
            <button
              key={filter}
              className={`${styles.filterButton} ${todoFilter === filter ? styles.filterButtonActive : ''}`}
              onClick={() => setTodoFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <ul className={styles.todoList}>
          {visibleTodos.map((item) => (
            <li key={item.id} className={styles.todoItem}>
              <button className={styles.todoToggle} onClick={() => toggleTodo(item.id)} type="button">
                {item.done ? '✅' : '⬜'}
              </button>
              <span className={item.done ? styles.todoDone : ''}>{item.text}</span>
              <button className={styles.todoRemove} onClick={() => removeTodo(item.id)} type="button">
                remove
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard note="用意：演示同一 store 中另一组偏好状态分区管理。" title="块 3：Preferences State（UI 偏好状态）">
        <div className={styles.preferencesGrid}>
          <div>
            <p className={styles.metaLabel}>Theme</p>
            <div className={styles.actions}>
              <button className={styles.buttonGhost} onClick={() => setTheme('light')} type="button">
                light
              </button>
              <button className={styles.buttonGhost} onClick={() => setTheme('dark')} type="button">
                dark
              </button>
            </div>
          </div>
          <div>
            <p className={styles.metaLabel}>Density</p>
            <button className={styles.buttonGhost} onClick={cycleDensity} type="button">
              toggle density
            </button>
          </div>
          <div>
            <p className={styles.metaLabel}>Hints</p>
            <button className={styles.buttonGhost} onClick={toggleHints} type="button">
              toggle hints
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：在同一个组件里联合读取多个状态分区，并执行组合动作。"
        title="块 4：多状态联合使用（组合视图 + 联合操作）"
      >
        <div className={styles.summaryPanel}>
          <p>
            当前 count：<strong>{count}</strong>
          </p>
          <p>
            未完成任务：<strong>{pendingCount}</strong>
          </p>
          <p>
            当前 theme：<strong>{theme}</strong>
          </p>
          <p>
            当前 density：<strong>{density}</strong>
          </p>
          <p>
            hints：<strong>{showHints ? 'on' : 'off'}</strong>
          </p>
        </div>
        <button className={styles.button} onClick={runCombinedReset} type="button">
          联合操作：重置计数 + 清理已完成 + 切换密度
        </button>
      </SectionCard>
    </div>
  );
}
