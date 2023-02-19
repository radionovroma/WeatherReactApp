import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface State {
  isAuth: boolean;
  name: string;
}

const SLICE_NAME = 'user';

const initialState: State = {
  isAuth: false,
  name: '',
}

export const { reducer: slice, actions } = createSlice( {
  name: SLICE_NAME,
  initialState,
  reducers: {
    inputName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    login: (state) => {
      state.name = state.name.trim();
      state.isAuth = true;
    }
  }
} );
