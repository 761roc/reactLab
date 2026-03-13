import { atom } from 'jotai';

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

export const counterAtom = atom(0);

export const todoItemsAtom = atom<TodoItem[]>([
  { id: 1, text: '拆分模块边界', done: true },
  { id: 2, text: '新增 Jotai Demo', done: false },
  { id: 3, text: '验证派生 atom', done: false }
]);

export const todoFilterAtom = atom<TodoFilter>('all');
export const nextTodoIdAtom = atom(4);

export const preferencesAtom = atom<PreferencesState>({
  theme: 'light',
  density: 'cozy',
  showHints: true
});

export const visibleTodosAtom = atom((get) => {
  const todos = get(todoItemsAtom);
  const filter = get(todoFilterAtom);

  if (filter === 'active') {
    return todos.filter((item) => !item.done);
  }
  if (filter === 'done') {
    return todos.filter((item) => item.done);
  }
  return todos;
});

export const pendingCountAtom = atom((get) => get(todoItemsAtom).filter((item) => !item.done).length);

export const addTodoAtom = atom(null, (get, set, text: string) => {
  const normalized = text.trim();
  if (!normalized) {
    return;
  }

  const nextId = get(nextTodoIdAtom);
  set(todoItemsAtom, (prev) => prev.concat({ id: nextId, text: normalized, done: false }));
  set(nextTodoIdAtom, nextId + 1);
});

export const toggleTodoAtom = atom(null, (get, set, id: number) => {
  const current = get(todoItemsAtom);
  set(
    todoItemsAtom,
    current.map((item) =>
      item.id === id
        ? {
            ...item,
            done: !item.done
          }
        : item
    )
  );
});

export const removeTodoAtom = atom(null, (get, set, id: number) => {
  const current = get(todoItemsAtom);
  set(
    todoItemsAtom,
    current.filter((item) => item.id !== id)
  );
});

export const clearCompletedAtom = atom(null, (get, set) => {
  const current = get(todoItemsAtom);
  set(
    todoItemsAtom,
    current.filter((item) => !item.done)
  );
});

export const runCombinedResetAtom = atom(null, (get, set) => {
  const currentTodos = get(todoItemsAtom);
  const prefs = get(preferencesAtom);

  set(counterAtom, 0);
  set(
    todoItemsAtom,
    currentTodos.filter((item) => !item.done)
  );
  set(preferencesAtom, {
    ...prefs,
    density: prefs.density === 'cozy' ? 'compact' : 'cozy',
    showHints: true
  });
});
