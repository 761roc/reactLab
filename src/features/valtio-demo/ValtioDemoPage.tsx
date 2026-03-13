import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { SectionCard } from '../../common/ui/SectionCard';
import { useValtioDemoStore } from './ValtioDemoProviders';
import styles from './ValtioDemoPage.module.css';

export default function ValtioDemoPage() {
  const [draft, setDraft] = useState('');
  const store = useValtioDemoStore();
  const snap = useSnapshot(store.state);

  const visibleTodos =
    snap.todoFilter === 'active'
      ? snap.todoItems.filter((item) => !item.done)
      : snap.todoFilter === 'done'
        ? snap.todoItems.filter((item) => item.done)
        : snap.todoItems;

  const pendingCount = snap.todoItems.filter((item) => !item.done).length;

  return (
    <div className={styles.wrapper}>
      <header>
        <h2 className={styles.title}>Valtio playground</h2>
        <p className={styles.note}>Valtio proxy state is scoped only to this feature via withProviders().</p>
      </header>

      <SectionCard note="用意：演示 proxy 状态与基础增减操作。" title="块 1：Counter State（基础状态管理）">
        <div className={styles.counterPanel}>
          <p className={styles.counterValue}>{snap.count}</p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={store.actions.decrement} type="button">
              -1
            </button>
            <button className={styles.button} onClick={store.actions.increment} type="button">
              +1
            </button>
            <button className={styles.buttonGhost} onClick={store.actions.resetCount} type="button">
              reset
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示列表数据、过滤切换与增删改。" title="块 2：Todo State（列表与过滤）">
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
              store.actions.addTodo(draft);
              setDraft('');
            }}
            type="button"
          >
            Add
          </button>
          <button className={styles.buttonGhost} onClick={store.actions.clearCompleted} type="button">
            Clear done
          </button>
        </div>

        <div className={styles.filters}>
          {(['all', 'active', 'done'] as const).map((filter) => (
            <button
              key={filter}
              className={`${styles.filterButton} ${snap.todoFilter === filter ? styles.filterButtonActive : ''}`}
              onClick={() => store.actions.setTodoFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <ul className={styles.todoList}>
          {visibleTodos.map((item) => (
            <li key={item.id} className={styles.todoItem}>
              <button className={styles.todoToggle} onClick={() => store.actions.toggleTodo(item.id)} type="button">
                {item.done ? '✅' : '⬜'}
              </button>
              <span className={item.done ? styles.todoDone : ''}>{item.text}</span>
              <button className={styles.todoRemove} onClick={() => store.actions.removeTodo(item.id)} type="button">
                remove
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard note="用意：演示同一状态树中的偏好状态分区。" title="块 3：Preferences State（UI 偏好状态）">
        <div className={styles.preferencesGrid}>
          <div>
            <p className={styles.metaLabel}>Theme</p>
            <div className={styles.actions}>
              <button className={styles.buttonGhost} onClick={() => store.actions.setTheme('light')} type="button">
                light
              </button>
              <button className={styles.buttonGhost} onClick={() => store.actions.setTheme('dark')} type="button">
                dark
              </button>
            </div>
          </div>
          <div>
            <p className={styles.metaLabel}>Density</p>
            <button className={styles.buttonGhost} onClick={store.actions.cycleDensity} type="button">
              toggle density
            </button>
          </div>
          <div>
            <p className={styles.metaLabel}>Hints</p>
            <button className={styles.buttonGhost} onClick={store.actions.toggleHints} type="button">
              toggle hints
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：在同一组件里联合读取多个状态分区，并执行组合动作。"
        title="块 4：多状态联合使用（组合视图 + 联合操作）"
      >
        <div className={styles.summaryPanel}>
          <p>
            当前 count：<strong>{snap.count}</strong>
          </p>
          <p>
            未完成任务：<strong>{pendingCount}</strong>
          </p>
          <p>
            当前 theme：<strong>{snap.preferences.theme}</strong>
          </p>
          <p>
            当前 density：<strong>{snap.preferences.density}</strong>
          </p>
          <p>
            hints：<strong>{snap.preferences.showHints ? 'on' : 'off'}</strong>
          </p>
          <p>
            当前过滤：<strong>{snap.todoFilter}</strong>
          </p>
        </div>
        <button className={styles.button} onClick={store.actions.runCombinedReset} type="button">
          联合操作：重置计数 + 清理已完成 + 切换密度
        </button>
      </SectionCard>
    </div>
  );
}
