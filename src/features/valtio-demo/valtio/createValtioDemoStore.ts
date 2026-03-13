import { proxy } from 'valtio';

export type TodoFilter = 'all' | 'active' | 'done';

export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

export interface PreferencesState {
  theme: 'light' | 'dark';
  density: 'cozy' | 'compact';
  showHints: boolean;
}

export interface ValtioDemoState {
  count: number;
  todoItems: TodoItem[];
  todoFilter: TodoFilter;
  nextTodoId: number;
  preferences: PreferencesState;
}

export interface ValtioDemoActions {
  increment: () => void;
  decrement: () => void;
  resetCount: () => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  setTodoFilter: (filter: TodoFilter) => void;
  clearCompleted: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  cycleDensity: () => void;
  toggleHints: () => void;
  runCombinedReset: () => void;
}

export interface ValtioDemoStore {
  state: ValtioDemoState;
  actions: ValtioDemoActions;
}

export function createValtioDemoStore(): ValtioDemoStore {
  const state = proxy<ValtioDemoState>({
    count: 0,
    todoItems: [
      { id: 1, text: '拆分模块边界', done: true },
      { id: 2, text: '新增 Valtio Demo', done: false },
      { id: 3, text: '验证快照联合读取', done: false }
    ],
    todoFilter: 'all',
    nextTodoId: 4,
    preferences: {
      theme: 'light',
      density: 'cozy',
      showHints: true
    }
  });

  const actions: ValtioDemoActions = {
    increment: () => {
      state.count += 1;
    },
    decrement: () => {
      state.count -= 1;
    },
    resetCount: () => {
      state.count = 0;
    },
    addTodo: (text) => {
      const normalized = text.trim();
      if (!normalized) {
        return;
      }

      state.todoItems.push({
        id: state.nextTodoId,
        text: normalized,
        done: false
      });
      state.nextTodoId += 1;
    },
    toggleTodo: (id) => {
      const target = state.todoItems.find((item) => item.id === id);
      if (target) {
        target.done = !target.done;
      }
    },
    removeTodo: (id) => {
      state.todoItems = state.todoItems.filter((item) => item.id !== id);
    },
    setTodoFilter: (filter) => {
      state.todoFilter = filter;
    },
    clearCompleted: () => {
      state.todoItems = state.todoItems.filter((item) => !item.done);
    },
    setTheme: (theme) => {
      state.preferences.theme = theme;
    },
    cycleDensity: () => {
      state.preferences.density = state.preferences.density === 'cozy' ? 'compact' : 'cozy';
    },
    toggleHints: () => {
      state.preferences.showHints = !state.preferences.showHints;
    },
    runCombinedReset: () => {
      state.count = 0;
      state.todoItems = state.todoItems.filter((item) => !item.done);
      state.preferences.density = state.preferences.density === 'cozy' ? 'compact' : 'cozy';
      state.preferences.showHints = true;
    }
  };

  return { state, actions };
}
