import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand';

export type PersistMode = 'whitelist' | 'blacklist';
export type TodoFilter = 'all' | 'active' | 'done';

export const ZUSTAND_PERSIST_KEYS = {
  whitelist: 'zustand-demo-whitelist',
  blacklist: 'zustand-demo-blacklist'
} as const;

export const ZUSTAND_PERSIST_RULES = {
  whitelist: ['count'],
  blacklist: ['theme', 'density', 'showHints']
} as const;

export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

type ThemeMode = 'light' | 'dark';
type DensityMode = 'cozy' | 'compact';

export interface ZustandDemoSnapshot {
  count?: number;
  todoItems?: TodoItem[];
  todoFilter?: TodoFilter;
  nextTodoId?: number;
  theme?: ThemeMode;
  density?: DensityMode;
  showHints?: boolean;
}

export interface ZustandDemoState {
  count: number;
  todoItems: TodoItem[];
  todoFilter: TodoFilter;
  nextTodoId: number;
  theme: ThemeMode;
  density: DensityMode;
  showHints: boolean;
  increment: () => void;
  decrement: () => void;
  resetCount: () => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  setTodoFilter: (filter: TodoFilter) => void;
  clearCompleted: () => void;
  setTheme: (theme: ThemeMode) => void;
  cycleDensity: () => void;
  toggleHints: () => void;
  runCombinedReset: () => void;
}

export type ZustandDemoStore = StoreApi<ZustandDemoState>;

function createInitialState(initial?: ZustandDemoSnapshot) {
  return {
    count: initial?.count ?? 0,
    todoItems: initial?.todoItems ?? [
      { id: 1, text: '拆分模块边界', done: true },
      { id: 2, text: '新增 Zustand Demo', done: false },
      { id: 3, text: '验证联合状态读取', done: false }
    ],
    todoFilter: initial?.todoFilter ?? 'all',
    nextTodoId: initial?.nextTodoId ?? 4,
    theme: initial?.theme ?? 'light',
    density: initial?.density ?? 'cozy',
    showHints: initial?.showHints ?? true
  };
}

export function buildZustandSnapshotByMode(state: ZustandDemoState, mode: PersistMode): ZustandDemoSnapshot {
  if (mode === 'whitelist') {
    return {
      count: state.count
    };
  }

  return {
    count: state.count,
    todoItems: state.todoItems.map((item) => ({ ...item })),
    todoFilter: state.todoFilter,
    nextTodoId: state.nextTodoId
  };
}

export function createZustandDemoStore(initial?: ZustandDemoSnapshot): ZustandDemoStore {
  const defaults = createInitialState(initial);

  return createStore<ZustandDemoState>((set, get) => ({
    count: defaults.count,
    todoItems: defaults.todoItems,
    todoFilter: defaults.todoFilter,
    nextTodoId: defaults.nextTodoId,
    theme: defaults.theme,
    density: defaults.density,
    showHints: defaults.showHints,

    increment: () => {
      set((state) => ({ count: state.count + 1 }));
    },

    decrement: () => {
      set((state) => ({ count: state.count - 1 }));
    },

    resetCount: () => {
      set({ count: 0 });
    },

    addTodo: (text) => {
      const normalized = text.trim();
      if (!normalized) {
        return;
      }

      set((state) => ({
        todoItems: state.todoItems.concat({ id: state.nextTodoId, text: normalized, done: false }),
        nextTodoId: state.nextTodoId + 1
      }));
    },

    toggleTodo: (id) => {
      set((state) => ({
        todoItems: state.todoItems.map((item) =>
          item.id === id
            ? {
                ...item,
                done: !item.done
              }
            : item
        )
      }));
    },

    removeTodo: (id) => {
      set((state) => ({
        todoItems: state.todoItems.filter((item) => item.id !== id)
      }));
    },

    setTodoFilter: (filter) => {
      set({ todoFilter: filter });
    },

    clearCompleted: () => {
      set((state) => ({
        todoItems: state.todoItems.filter((item) => !item.done)
      }));
    },

    setTheme: (theme) => {
      set({ theme });
    },

    cycleDensity: () => {
      set((state) => ({ density: state.density === 'cozy' ? 'compact' : 'cozy' }));
    },

    toggleHints: () => {
      set((state) => ({ showHints: !state.showHints }));
    },

    runCombinedReset: () => {
      const state = get();
      set({
        count: 0,
        todoItems: state.todoItems.filter((item) => !item.done),
        density: state.density === 'cozy' ? 'compact' : 'cozy',
        showHints: true
      });
    }
  }));
}
