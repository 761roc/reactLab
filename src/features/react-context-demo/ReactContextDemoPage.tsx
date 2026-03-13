import { useMemo, useState } from 'react';
import { SectionCard } from '../../common/ui/SectionCard';
import { useReactContextDemoStore } from './ReactContextDemoProviders';
import styles from './ReactContextDemoPage.module.css';

export default function ReactContextDemoPage() {
  const [draft, setDraft] = useState('');
  const { state, actions } = useReactContextDemoStore();

  const visibleTodos = useMemo(() => {
    if (state.todoFilter === 'active') {
      return state.todoItems.filter((item) => !item.done);
    }
    if (state.todoFilter === 'done') {
      return state.todoItems.filter((item) => item.done);
    }
    return state.todoItems;
  }, [state.todoFilter, state.todoItems]);

  const pendingCount = useMemo(() => state.todoItems.filter((item) => !item.done).length, [state.todoItems]);

  return (
    <div className={styles.wrapper}>
      <header>
        <h2 className={styles.title}>React Context playground</h2>
        <p className={styles.note}>Context Provider is scoped only to this feature via withProviders().</p>
      </header>

      <SectionCard note="用意：演示 useReducer + useContext 的基础状态流。" title="块 1：Counter State（基础状态管理）">
        <div className={styles.counterPanel}>
          <p className={styles.counterValue}>{state.count}</p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={actions.decrement} type="button">
              -1
            </button>
            <button className={styles.button} onClick={actions.increment} type="button">
              +1
            </button>
            <button className={styles.buttonGhost} onClick={actions.resetCount} type="button">
              reset
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示 reducer 中的列表增删改与过滤动作。" title="块 2：Todo State（列表与过滤）">
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
              actions.addTodo(draft);
              setDraft('');
            }}
            type="button"
          >
            Add
          </button>
          <button className={styles.buttonGhost} onClick={actions.clearCompleted} type="button">
            Clear done
          </button>
        </div>

        <div className={styles.filters}>
          {(['all', 'active', 'done'] as const).map((filter) => (
            <button
              key={filter}
              className={`${styles.filterButton} ${state.todoFilter === filter ? styles.filterButtonActive : ''}`}
              onClick={() => actions.setTodoFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <ul className={styles.todoList}>
          {visibleTodos.map((item) => (
            <li key={item.id} className={styles.todoItem}>
              <button className={styles.todoToggle} onClick={() => actions.toggleTodo(item.id)} type="button">
                {item.done ? '✅' : '⬜'}
              </button>
              <span className={item.done ? styles.todoDone : ''}>{item.text}</span>
              <button className={styles.todoRemove} onClick={() => actions.removeTodo(item.id)} type="button">
                remove
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard note="用意：演示 Context 中另一组 UI 偏好状态管理。" title="块 3：Preferences State（UI 偏好状态）">
        <div className={styles.preferencesGrid}>
          <div>
            <p className={styles.metaLabel}>Theme</p>
            <div className={styles.actions}>
              <button className={styles.buttonGhost} onClick={() => actions.setTheme('light')} type="button">
                light
              </button>
              <button className={styles.buttonGhost} onClick={() => actions.setTheme('dark')} type="button">
                dark
              </button>
            </div>
          </div>
          <div>
            <p className={styles.metaLabel}>Density</p>
            <button className={styles.buttonGhost} onClick={actions.cycleDensity} type="button">
              toggle density
            </button>
          </div>
          <div>
            <p className={styles.metaLabel}>Hints</p>
            <button className={styles.buttonGhost} onClick={actions.toggleHints} type="button">
              toggle hints
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：同一组件内联合读取 Context 多个状态域，并触发组合动作。"
        title="块 4：多状态联合使用（组合视图 + 联合操作）"
      >
        <div className={styles.summaryPanel}>
          <p>
            当前 count：<strong>{state.count}</strong>
          </p>
          <p>
            未完成任务：<strong>{pendingCount}</strong>
          </p>
          <p>
            当前 theme：<strong>{state.preferences.theme}</strong>
          </p>
          <p>
            当前 density：<strong>{state.preferences.density}</strong>
          </p>
          <p>
            hints：<strong>{state.preferences.showHints ? 'on' : 'off'}</strong>
          </p>
          <p>
            当前过滤：<strong>{state.todoFilter}</strong>
          </p>
        </div>
        <button className={styles.button} onClick={actions.runCombinedReset} type="button">
          联合操作：重置计数 + 清理已完成 + 切换密度
        </button>
      </SectionCard>
    </div>
  );
}
