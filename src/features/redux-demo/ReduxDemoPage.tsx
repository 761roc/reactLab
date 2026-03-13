import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SectionCard } from '../../common/ui/SectionCard';
import { decrement, increment, reset } from './redux/counterSlice';
import { cycleDensity, setTheme, toggleHints } from './redux/preferencesSlice';
import { addTodo, clearCompleted, removeTodo, setTodoFilter, toggleTodo } from './redux/todoSlice';
import type { AppDispatch, RootState } from './redux/store';
import styles from './ReduxDemoPage.module.css';

export default function ReduxDemoPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [draft, setDraft] = useState('');

  const count = useSelector((state: RootState) => state.counter.value);
  const todoItems = useSelector((state: RootState) => state.todo.items);
  const todoFilter = useSelector((state: RootState) => state.todo.filter);
  const preferences = useSelector((state: RootState) => state.preferences);

  const visibleTodos = useMemo(() => {
    if (todoFilter === 'active') {
      return todoItems.filter((item) => !item.done);
    }
    if (todoFilter === 'done') {
      return todoItems.filter((item) => item.done);
    }
    return todoItems;
  }, [todoFilter, todoItems]);

  const pendingCount = useMemo(() => todoItems.filter((item) => !item.done).length, [todoItems]);

  const runCombinedReset = () => {
    dispatch(reset());
    dispatch(clearCompleted());
    dispatch(cycleDensity());
    if (!preferences.showHints) {
      dispatch(toggleHints());
    }
  };

  return (
    <div className={styles.wrapper}>
      <header>
        <h2 className={styles.title}>Redux playground</h2>
        <p className={styles.note}>Redux store lives only in this feature via withProviders().</p>
      </header>

      <SectionCard note="用意：演示单一 slice 的基础读写和 action 派发。" title="块 1：Counter Slice（基础状态管理）">
        <div className={styles.counterPanel}>
          <p className={styles.counterValue}>{count}</p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => dispatch(decrement())} type="button">
              -1
            </button>
            <button className={styles.button} onClick={() => dispatch(increment())} type="button">
              +1
            </button>
            <button className={styles.buttonGhost} onClick={() => dispatch(reset())} type="button">
              reset
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示第二个 slice 的独立状态、筛选逻辑和列表更新。" title="块 2：Todo Slice（列表与过滤）">
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
              dispatch(addTodo(draft));
              setDraft('');
            }}
            type="button"
          >
            Add
          </button>
          <button className={styles.buttonGhost} onClick={() => dispatch(clearCompleted())} type="button">
            Clear done
          </button>
        </div>

        <div className={styles.filters}>
          {(['all', 'active', 'done'] as const).map((filter) => (
            <button
              key={filter}
              className={`${styles.filterButton} ${todoFilter === filter ? styles.filterButtonActive : ''}`}
              onClick={() => dispatch(setTodoFilter(filter))}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <ul className={styles.todoList}>
          {visibleTodos.map((item) => (
            <li key={item.id} className={styles.todoItem}>
              <button className={styles.todoToggle} onClick={() => dispatch(toggleTodo(item.id))} type="button">
                {item.done ? '✅' : '⬜'}
              </button>
              <span className={item.done ? styles.todoDone : ''}>{item.text}</span>
              <button className={styles.todoRemove} onClick={() => dispatch(removeTodo(item.id))} type="button">
                remove
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard note="用意：演示第三个 slice 的偏好设置（theme/density/hints）。" title="块 3：Preferences Slice（UI 偏好状态）">
        <div className={styles.preferencesGrid}>
          <div>
            <p className={styles.metaLabel}>Theme</p>
            <div className={styles.actions}>
              <button className={styles.buttonGhost} onClick={() => dispatch(setTheme('light'))} type="button">
                light
              </button>
              <button className={styles.buttonGhost} onClick={() => dispatch(setTheme('dark'))} type="button">
                dark
              </button>
            </div>
          </div>
          <div>
            <p className={styles.metaLabel}>Density</p>
            <button className={styles.buttonGhost} onClick={() => dispatch(cycleDensity())} type="button">
              toggle density
            </button>
          </div>
          <div>
            <p className={styles.metaLabel}>Hints</p>
            <button className={styles.buttonGhost} onClick={() => dispatch(toggleHints())} type="button">
              toggle hints
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：在同一个组件里联合读取多个 slice（counter/todo/preferences），并一次触发多个 action。"
        title="块 4：多 Slice 联合使用（组合视图 + 联合派发）"
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
        </div>
        <button className={styles.button} onClick={runCombinedReset} type="button">
          联合操作：重置计数 + 清理已完成 + 切换密度
        </button>
      </SectionCard>
    </div>
  );
}
