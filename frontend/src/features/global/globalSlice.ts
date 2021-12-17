import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';

export interface GlobalState {
  user: string | null;
}

const initialState: GlobalState = {
  user: null,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = globalSlice.actions;

export const selectUser = (state: RootState) => state.global.user;

export default globalSlice.reducer;
