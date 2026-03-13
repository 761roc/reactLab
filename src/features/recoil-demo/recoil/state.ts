import { atom, selector } from 'recoil';

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

export const counterAtom = atom<number>({
  key: 'recoilDemo/counter',
  default: 0
});

export const todoItemsAtom = atom<TodoItem[]>({
  key: 'recoilDemo/todoItems',
  default: [
    { id: 1, text: '拆分模块边界', done: true },
    { id: 2, text: '新增 Recoil Demo', done: false },
    { id: 3, text: '验证 selector 组合', done: false }
  ]
});

export const todoFilterAtom = atom<TodoFilter>({
  key: 'recoilDemo/todoFilter',
  default: 'all'
});

export const nextTodoIdAtom = atom<number>({
  key: 'recoilDemo/nextTodoId',
  default: 4
});

export const preferencesAtom = atom<PreferencesState>({
  key: 'recoilDemo/preferences',
  default: {
    theme: 'light',
    density: 'cozy',
    showHints: true
  }
});

export const visibleTodosSelector = selector<TodoItem[]>({
  key: 'recoilDemo/visibleTodos',
  get: ({ get }) => {
    const todos = get(todoItemsAtom);
    const filter = get(todoFilterAtom);

    if (filter === 'active') {
      return todos.filter((item) => !item.done);
    }

    if (filter === 'done') {
      return todos.filter((item) => item.done);
    }

    return todos;
  }
});

export const pendingCountSelector = selector<number>({
  key: 'recoilDemo/pendingCount',
  get: ({ get }) => get(todoItemsAtom).filter((item) => !item.done).length
});
