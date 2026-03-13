import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';

type TodoFilter = 'all' | 'active' | 'done';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

interface PreferencesState {
  theme: 'light' | 'dark';
  density: 'cozy' | 'compact';
  showHints: boolean;
}

interface ReactContextDemoState {
  count: number;
  todoItems: TodoItem[];
  todoFilter: TodoFilter;
  nextTodoId: number;
  preferences: PreferencesState;
}

type ReactContextDemoAction =
  | { type: 'count/increment' }
  | { type: 'count/decrement' }
  | { type: 'count/reset' }
  | { type: 'todo/add'; payload: string }
  | { type: 'todo/toggle'; payload: number }
  | { type: 'todo/remove'; payload: number }
  | { type: 'todo/filter'; payload: TodoFilter }
  | { type: 'todo/clearCompleted' }
  | { type: 'preferences/theme'; payload: 'light' | 'dark' }
  | { type: 'preferences/cycleDensity' }
  | { type: 'preferences/toggleHints' }
  | { type: 'combined/resetFlow' };

interface ReactContextDemoActions {
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

interface ReactContextDemoStore {
  state: ReactContextDemoState;
  actions: ReactContextDemoActions;
}

const initialState: ReactContextDemoState = {
  count: 0,
  todoItems: [
    { id: 1, text: '拆分模块边界', done: true },
    { id: 2, text: '新增 React Context Demo', done: false },
    { id: 3, text: '验证 reducer + context', done: false }
  ],
  todoFilter: 'all',
  nextTodoId: 4,
  preferences: {
    theme: 'light',
    density: 'cozy',
    showHints: true
  }
};

function reducer(state: ReactContextDemoState, action: ReactContextDemoAction): ReactContextDemoState {
  switch (action.type) {
    case 'count/increment':
      return { ...state, count: state.count + 1 };
    case 'count/decrement':
      return { ...state, count: state.count - 1 };
    case 'count/reset':
      return { ...state, count: 0 };
    case 'todo/add': {
      const normalized = action.payload.trim();
      if (!normalized) {
        return state;
      }

      return {
        ...state,
        todoItems: state.todoItems.concat({ id: state.nextTodoId, text: normalized, done: false }),
        nextTodoId: state.nextTodoId + 1
      };
    }
    case 'todo/toggle':
      return {
        ...state,
        todoItems: state.todoItems.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                done: !item.done
              }
            : item
        )
      };
    case 'todo/remove':
      return {
        ...state,
        todoItems: state.todoItems.filter((item) => item.id !== action.payload)
      };
    case 'todo/filter':
      return {
        ...state,
        todoFilter: action.payload
      };
    case 'todo/clearCompleted':
      return {
        ...state,
        todoItems: state.todoItems.filter((item) => !item.done)
      };
    case 'preferences/theme':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          theme: action.payload
        }
      };
    case 'preferences/cycleDensity':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          density: state.preferences.density === 'cozy' ? 'compact' : 'cozy'
        }
      };
    case 'preferences/toggleHints':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          showHints: !state.preferences.showHints
        }
      };
    case 'combined/resetFlow':
      return {
        ...state,
        count: 0,
        todoItems: state.todoItems.filter((item) => !item.done),
        preferences: {
          ...state.preferences,
          density: state.preferences.density === 'cozy' ? 'compact' : 'cozy',
          showHints: true
        }
      };
    default:
      return state;
  }
}

const ReactContextDemoStoreContext = createContext<ReactContextDemoStore | null>(null);

export function ReactContextDemoProviders({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo<ReactContextDemoActions>(
    () => ({
      increment: () => dispatch({ type: 'count/increment' }),
      decrement: () => dispatch({ type: 'count/decrement' }),
      resetCount: () => dispatch({ type: 'count/reset' }),
      addTodo: (text) => dispatch({ type: 'todo/add', payload: text }),
      toggleTodo: (id) => dispatch({ type: 'todo/toggle', payload: id }),
      removeTodo: (id) => dispatch({ type: 'todo/remove', payload: id }),
      setTodoFilter: (filter) => dispatch({ type: 'todo/filter', payload: filter }),
      clearCompleted: () => dispatch({ type: 'todo/clearCompleted' }),
      setTheme: (theme) => dispatch({ type: 'preferences/theme', payload: theme }),
      cycleDensity: () => dispatch({ type: 'preferences/cycleDensity' }),
      toggleHints: () => dispatch({ type: 'preferences/toggleHints' }),
      runCombinedReset: () => dispatch({ type: 'combined/resetFlow' })
    }),
    []
  );

  const store = useMemo<ReactContextDemoStore>(() => ({ state, actions }), [actions, state]);

  return <ReactContextDemoStoreContext.Provider value={store}>{children}</ReactContextDemoStoreContext.Provider>;
}

export function useReactContextDemoStore() {
  const store = useContext(ReactContextDemoStoreContext);
  if (!store) {
    throw new Error('useReactContextDemoStore must be used within ReactContextDemoProviders');
  }

  return store;
}
