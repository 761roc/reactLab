import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand';

type TodoFilter = 'all' | 'active' | 'done';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

type ThemeMode = 'light' | 'dark';
type DensityMode = 'cozy' | 'compact';

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

export function createZustandDemoStore(): ZustandDemoStore {
  return createStore<ZustandDemoState>((set, get) => ({
    count: 0,
    todoItems: [
      { id: 1, text: '拆分模块边界', done: true },
      { id: 2, text: '新增 Zustand Demo', done: false },
      { id: 3, text: '验证联合状态读取', done: false }
    ],
    todoFilter: 'all',
    nextTodoId: 4,
    theme: 'light',
    density: 'cozy',
    showHints: true,

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
