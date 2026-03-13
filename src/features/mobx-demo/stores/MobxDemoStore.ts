import { makeAutoObservable } from 'mobx';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this);
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

  filter: 'all' | 'active' | 'done' = 'all';
  nextId = 4;

  constructor() {
    makeAutoObservable(this);
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

  setFilter(filter: 'all' | 'active' | 'done') {
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

  constructor() {
    makeAutoObservable(this);
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
  counter = new CounterStore();
  todo = new TodoStore();
  preferences = new PreferencesStore();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
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
