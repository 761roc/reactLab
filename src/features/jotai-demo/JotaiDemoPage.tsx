import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import {
  addTodoAtom,
  clearCompletedAtom,
  counterAtom,
  pendingCountAtom,
  preferencesAtom,
  removeTodoAtom,
  runCombinedResetAtom,
  todoFilterAtom,
  toggleTodoAtom,
  visibleTodosAtom
} from './jotai/state';
import styles from './JotaiDemoPage.module.css';

export default function JotaiDemoPage() {
  const [draft, setDraft] = useState('');

  const [count, setCount] = useAtom(counterAtom);
  const [todoFilter, setTodoFilter] = useAtom(todoFilterAtom);
  const [preferences, setPreferences] = useAtom(preferencesAtom);

  const visibleTodos = useAtomValue(visibleTodosAtom);
  const pendingCount = useAtomValue(pendingCountAtom);

  const addTodo = useSetAtom(addTodoAtom);
  const toggleTodo = useSetAtom(toggleTodoAtom);
  const removeTodo = useSetAtom(removeTodoAtom);
  const clearCompleted = useSetAtom(clearCompletedAtom);
  const runCombinedReset = useSetAtom(runCombinedResetAtom);

  return (
    <div className={styles.wrapper}>
      <header>
        <h2 className={styles.title}>Jotai playground</h2>
        <p className={styles.note}>Jotai Provider is scoped only to this feature via withProviders().</p>
      </header>

      <SectionCard note="用意：演示 atom 的基础读写与更新。" title="块 1：Counter Atom（基础状态管理）">
        <div className={styles.counterPanel}>
          <p className={styles.counterValue}>{count}</p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => setCount((prev) => prev - 1)} type="button">
              -1
            </button>
            <button className={styles.button} onClick={() => setCount((prev) => prev + 1)} type="button">
              +1
            </button>
            <button className={styles.buttonGhost} onClick={() => setCount(0)} type="button">
              reset
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示派生 atom 与写入 atom 的列表流转。" title="块 2：Todo Atoms（列表与过滤）">
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
          <button className={styles.buttonGhost} onClick={() => clearCompleted()} type="button">
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

      <SectionCard note="用意：演示另一组 atom 状态的偏好管理。" title="块 3：Preferences Atom（UI 偏好状态）">
        <div className={styles.preferencesGrid}>
          <div>
            <p className={styles.metaLabel}>Theme</p>
            <div className={styles.actions}>
              <button className={styles.buttonGhost} onClick={() => setPreferences((prev) => ({ ...prev, theme: 'light' }))} type="button">
                light
              </button>
              <button className={styles.buttonGhost} onClick={() => setPreferences((prev) => ({ ...prev, theme: 'dark' }))} type="button">
                dark
              </button>
            </div>
          </div>
          <div>
            <p className={styles.metaLabel}>Density</p>
            <button
              className={styles.buttonGhost}
              onClick={() =>
                setPreferences((prev) => ({
                  ...prev,
                  density: prev.density === 'cozy' ? 'compact' : 'cozy'
                }))
              }
              type="button"
            >
              toggle density
            </button>
          </div>
          <div>
            <p className={styles.metaLabel}>Hints</p>
            <button className={styles.buttonGhost} onClick={() => setPreferences((prev) => ({ ...prev, showHints: !prev.showHints }))} type="button">
              toggle hints
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：在同一组件联合读取多个 atom，并触发组合动作。"
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
            当前 theme：<strong>{preferences.theme}</strong>
          </p>
          <p>
            当前 density：<strong>{preferences.density}</strong>
          </p>
          <p>
            hints：<strong>{preferences.showHints ? 'on' : 'off'}</strong>
          </p>
          <p>
            当前过滤：<strong>{todoFilter}</strong>
          </p>
        </div>
        <button className={styles.button} onClick={() => runCombinedReset()} type="button">
          联合操作：重置计数 + 清理已完成 + 切换密度
        </button>
      </SectionCard>
    </div>
  );
}
