import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { PersistenceControlPanel, type PersistenceModeOption } from '../../common/ui/PersistenceControlPanel';
import { SectionCard } from '../../common/ui/SectionCard';
import { useMobxDemoPersistenceControls, useMobxDemoStore } from './MobxDemoProviders';
import type { MobxPersistMode } from './stores/MobxDemoStore';
import styles from './MobxDemoPage.module.css';

const persistModeOptions: Array<PersistenceModeOption<MobxPersistMode>> = [
  {
    value: 'whitelist',
    label: '白名单模式',
    description: '仅保存 counter，便于观察最小持久化范围。'
  },
  {
    value: 'blacklist',
    label: '黑名单模式',
    description: '排除 preferences，其它状态会保留。'
  }
];

function MobxDemoPageInner() {
  const store = useMobxDemoStore();
  const [draft, setDraft] = useState('');
  const { enabled, mode, setEnabled, setMode, clearPersistedState, ruleDescription, storageKey } = useMobxDemoPersistenceControls();

  const { counter, todo, preferences } = store;

  return (
    <div className={styles.wrapper}>
      <header className={styles.headerRow}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>MobX playground</h2>
          <p className={styles.note}>MobX store lives only in this feature via withProviders().</p>
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
          subtitle="切换策略后刷新页面，观察 MobX 状态是否恢复"
          title="MobX 持久化演示"
        />
      </header>

      <SectionCard note="用意：演示 observable 状态 + action 更新。" title="块 1：Counter Store（基础状态管理）">
        <div className={styles.counterPanel}>
          <p className={styles.counterValue}>{counter.value}</p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={counter.decrement} type="button">
              -1
            </button>
            <button className={styles.button} onClick={counter.increment} type="button">
              +1
            </button>
            <button className={styles.buttonGhost} onClick={counter.reset} type="button">
              reset
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard note="用意：演示列表数据、computed 过滤和增删改。" title="块 2：Todo Store（列表与过滤）">
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
              todo.addTodo(draft);
              setDraft('');
            }}
            type="button"
          >
            Add
          </button>
          <button className={styles.buttonGhost} onClick={todo.clearCompleted} type="button">
            Clear done
          </button>
        </div>

        <div className={styles.filters}>
          {(['all', 'active', 'done'] as const).map((filter) => (
            <button
              key={filter}
              className={`${styles.filterButton} ${todo.filter === filter ? styles.filterButtonActive : ''}`}
              onClick={() => todo.setFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <ul className={styles.todoList}>
          {todo.visibleTodos.map((item) => (
            <li key={item.id} className={styles.todoItem}>
              <button className={styles.todoToggle} onClick={() => todo.toggleTodo(item.id)} type="button">
                {item.done ? '✅' : '⬜'}
              </button>
              <span className={item.done ? styles.todoDone : ''}>{item.text}</span>
              <button className={styles.todoRemove} onClick={() => todo.removeTodo(item.id)} type="button">
                remove
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard note="用意：演示第三个 store 的 UI 偏好状态控制。" title="块 3：Preferences Store（UI 偏好状态）">
        <div className={styles.preferencesGrid}>
          <div>
            <p className={styles.metaLabel}>Theme</p>
            <div className={styles.actions}>
              <button className={styles.buttonGhost} onClick={() => preferences.setTheme('light')} type="button">
                light
              </button>
              <button className={styles.buttonGhost} onClick={() => preferences.setTheme('dark')} type="button">
                dark
              </button>
            </div>
          </div>
          <div>
            <p className={styles.metaLabel}>Density</p>
            <button className={styles.buttonGhost} onClick={preferences.cycleDensity} type="button">
              toggle density
            </button>
          </div>
          <div>
            <p className={styles.metaLabel}>Hints</p>
            <button className={styles.buttonGhost} onClick={preferences.toggleHints} type="button">
              toggle hints
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        note="用意：同一组件中联合读取多个 store，并一次触发多个 action 形成业务流。"
        title="块 4：多 Store 联合使用（组合视图 + 联合派发）"
      >
        <div className={styles.summaryPanel}>
          <p>
            当前 count：<strong>{counter.value}</strong>
          </p>
          <p>
            未完成任务：<strong>{todo.pendingCount}</strong>
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
        <button className={styles.button} onClick={store.runCombinedReset} type="button">
          联合操作：重置计数 + 清理已完成 + 切换密度
        </button>
      </SectionCard>
    </div>
  );
}

const MobxDemoPage = observer(MobxDemoPageInner);

export default MobxDemoPage;
