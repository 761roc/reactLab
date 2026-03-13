import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  theme: 'light' | 'dark';
  density: 'cozy' | 'compact';
  showHints: boolean;
}

const initialState: PreferencesState = {
  theme: 'light',
  density: 'cozy',
  showHints: true
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    cycleDensity: (state) => {
      state.density = state.density === 'cozy' ? 'compact' : 'cozy';
    },
    toggleHints: (state) => {
      state.showHints = !state.showHints;
    }
  }
});

export const { setTheme, cycleDensity, toggleHints } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
