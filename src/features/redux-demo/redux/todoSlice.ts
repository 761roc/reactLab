import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

interface TodoState {
  items: TodoItem[];
  nextId: number;
  filter: 'all' | 'active' | 'done';
}

const initialState: TodoState = {
  items: [
    { id: 1, text: '拆分模块边界', done: true },
    { id: 2, text: '增加多 slice 示例', done: false },
    { id: 3, text: '验证组合 selector', done: false }
  ],
  nextId: 4,
  filter: 'all'
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const text = action.payload.trim();
      if (!text) {
        return;
      }

      state.items.push({
        id: state.nextId,
        text,
        done: false
      });
      state.nextId += 1;
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.done = !target.done;
      }
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setTodoFilter: (state, action: PayloadAction<'all' | 'active' | 'done'>) => {
      state.filter = action.payload;
    },
    clearCompleted: (state) => {
      state.items = state.items.filter((item) => !item.done);
    }
  }
});

export const { addTodo, toggleTodo, removeTodo, setTodoFilter, clearCompleted } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
