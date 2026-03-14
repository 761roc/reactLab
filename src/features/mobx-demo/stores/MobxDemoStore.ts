import { makeAutoObservable } from 'mobx';

export type MobxPersistMode = 'whitelist' | 'blacklist';

export const MOBX_PERSIST_KEYS = {
  whitelist: 'mobx-demo-whitelist',
  blacklist: 'mobx-demo-blacklist'
} as const;

export const MOBX_PERSIST_RULES = {
  whitelist: ['counter'],
  blacklist: ['preferences']
} as const;

type TodoFilter = 'all' | 'active' | 'done';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

interface CounterSnapshot {
  value: number;
}

interface TodoSnapshot {
  items: TodoItem[];
  filter: TodoFilter;
  nextId: number;
}

interface PreferencesSnapshot {
  theme: 'light' | 'dark';
  density: 'cozy' | 'compact';
  showHints: boolean;
}

export interface MobxDemoSnapshot {
  counter?: CounterSnapshot;
  todo?: TodoSnapshot;
  preferences?: PreferencesSnapshot;
}

class CounterStore {
  value = 0;

  constructor(initial?: CounterSnapshot) {
    if (initial) {
      this.value = initial.value;
    }

    makeAutoObservable(this, {}, { autoBind: true });
  }

  increment() {
    this.value += 1;
  }

  decrement() {
    this.value -= 1;
  }

  reset() {
    this.value = 0;
  }
}

class TodoStore {
  items: TodoItem[] = [
    { id: 1, text: '拆分模块边界', done: true },
    { id: 2, text: '增加多 store 示例', done: false },
    { id: 3, text: '验证联合读取', done: false }
  ];

  filter: TodoFilter = 'all';
  nextId = 4;

  constructor(initial?: TodoSnapshot) {
    if (initial) {
      this.items = initial.items;
      this.filter = initial.filter;
      this.nextId = initial.nextId;
    }

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get visibleTodos() {
    if (this.filter === 'active') {
      return this.items.filter((item) => !item.done);
    }
    if (this.filter === 'done') {
      return this.items.filter((item) => item.done);
    }
    return this.items;
  }

  get pendingCount() {
    return this.items.filter((item) => !item.done).length;
  }

  addTodo(text: string) {
    const normalized = text.trim();
    if (!normalized) {
      return;
    }

    this.items.push({
      id: this.nextId,
      text: normalized,
      done: false
    });
    this.nextId += 1;
  }

  toggleTodo(id: number) {
    const target = this.items.find((item) => item.id === id);
    if (target) {
      target.done = !target.done;
    }
  }

  removeTodo(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  setFilter(filter: TodoFilter) {
    this.filter = filter;
  }

  clearCompleted() {
    this.items = this.items.filter((item) => !item.done);
  }
}

class PreferencesStore {
  theme: 'light' | 'dark' = 'light';
  density: 'cozy' | 'compact' = 'cozy';
  showHints = true;

  constructor(initial?: PreferencesSnapshot) {
    if (initial) {
      this.theme = initial.theme;
      this.density = initial.density;
      this.showHints = initial.showHints;
    }

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
  }

  cycleDensity() {
    this.density = this.density === 'cozy' ? 'compact' : 'cozy';
  }

  toggleHints() {
    this.showHints = !this.showHints;
  }
}

export class MobxDemoStore {
  counter: CounterStore;
  todo: TodoStore;
  preferences: PreferencesStore;

  constructor(initial?: MobxDemoSnapshot) {
    this.counter = new CounterStore(initial?.counter);
    this.todo = new TodoStore(initial?.todo);
    this.preferences = new PreferencesStore(initial?.preferences);

    makeAutoObservable(this, {}, { autoBind: true });
  }

  getSnapshot(): MobxDemoSnapshot {
    return {
      counter: {
        value: this.counter.value
      },
      todo: {
        items: this.todo.items.map((item) => ({ ...item })),
        filter: this.todo.filter,
        nextId: this.todo.nextId
      },
      preferences: {
        theme: this.preferences.theme,
        density: this.preferences.density,
        showHints: this.preferences.showHints
      }
    };
  }

  runCombinedReset() {
    this.counter.reset();
    this.todo.clearCompleted();
    this.preferences.cycleDensity();
    if (!this.preferences.showHints) {
      this.preferences.toggleHints();
    }
  }
}
