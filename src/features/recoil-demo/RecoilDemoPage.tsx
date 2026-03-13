import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { SectionCard } from '../../common/ui/SectionCard';
import {
  counterAtom,
  nextTodoIdAtom,
  pendingCountSelector,
  preferencesAtom,
  todoFilterAtom,
  todoItemsAtom,
  visibleTodosSelector
} from './recoil/state';
import styles from './RecoilDemoPage.module.css';

export default function RecoilDemoPage() {
  const [draft, setDraft] = useState('');

  const [count, setCount] = useRecoilState(counterAtom);

  const [todoItems, setTodoItems] = useRecoilState(todoItemsAtom);
  const [todoFilter, setTodoFilter] = useRecoilState(todoFilterAtom);
  const [nextTodoId, setNextTodoId] = useRecoilState(nextTodoIdAtom);
  const visibleTodos = useRecoilValue(visibleTodosSelector);
  const pendingCount = useRecoilValue(pendingCountSelector);

  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  const setCounter = useSetRecoilState(counterAtom);
  const setTodos = useSetRecoilState(todoItemsAtom);
  const setPrefs = useSetRecoilState(preferencesAtom);

  const addTodo = () => {
    const normalized = draft.trim();
    if (!normalized) {
      return;
    }

    setTodoItems((prev) => prev.concat({ id: nextTodoId, text: normalized, done: false }));
    setNextTodoId((id) => id + 1);
    setDraft('');
  };

  const clearCompleted = () => {
    setTodoItems((prev) => prev.filter((item) => !item.done));
  };

  const runCombinedReset = () => {
    setCounter(0);
    setTodos((prev) => prev.filter((item) => !item.done));
    setPrefs((prev) => ({
      ...prev,
      density: prev.density === 'cozy' ? 'compact' : 'cozy',
      showHints: true
    }));
  };

  return (
    <div className={styles.wrapper}>
      <header>
        <h2 className={styles.title}>Recoil playground</h2>
        <p className={styles.note}>RecoilRoot is scoped only to this feature via withProviders().</p>
      </header>

      <SectionCard note="用意：演示 atom 基础读写和本地动作封装。" title="块 1：Counter Atom（基础状态管理）">
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

      <SectionCard note="用意：演示 atom + selector 的列表过滤与增删改。" title="块 2：Todo Atoms + Selector（列表与过滤）">
        <div className={styles.todoControls}>
          <input
            className={styles.todoInput}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="输入任务后点击 Add"
            type="text"
            value={draft}
          />
          <button className={styles.button} onClick={addTodo} type="button">
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
              <button
                className={styles.todoToggle}
                onClick={() => {
                  setTodoItems((prev) =>
                    prev.map((todo) =>
                      todo.id === item.id
                        ? {
                            ...todo,
                            done: !todo.done
                          }
                        : todo
                    )
                  );
                }}
                type="button"
              >
                {item.done ? '✅' : '⬜'}
              </button>
              <span className={item.done ? styles.todoDone : ''}>{item.text}</span>
              <button
                className={styles.todoRemove}
                onClick={() => setTodoItems((prev) => prev.filter((todo) => todo.id !== item.id))}
                type="button"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard note="用意：演示另一组 atom 状态用于 UI 偏好管理。" title="块 3：Preferences Atom（UI 偏好状态）">
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
        note="用意：在同一组件联合读取多个 atom/selector，并执行组合更新动作。"
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
            todo 总数：<strong>{todoItems.length}</strong>
          </p>
        </div>
        <button className={styles.button} onClick={runCombinedReset} type="button">
          联合操作：重置计数 + 清理已完成 + 切换密度
        </button>
      </SectionCard>
    </div>
  );
}
