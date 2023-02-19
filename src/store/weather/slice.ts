import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getWeather } from "../../api";
import { LOAD_STATUSES } from '../../types/loadStatuses';
import { WeatherInfo } from "../../types/weather";

export interface State {
  weatherInfo: WeatherInfo | null;
  loadStatus: LOAD_STATUSES;
}

const SLICE_NAME = 'weather';

const initialState: State = {
  weatherInfo: null,
  loadStatus: LOAD_STATUSES.UNKNOWN,
}

export const fetchWeather = createAsyncThunk( SLICE_NAME,
  (params: { city: string, unit: string }) => {
    return getWeather( params.city, params.unit );
  } );

const { reducer: slice, actions: sliceActions } = createSlice( {
  name: SLICE_NAME,
  initialState,
  reducers: {
    start: (state) => {
      state.loadStatus = LOAD_STATUSES.LOADING;
    }
  },
  extraReducers: (builder) => {
    builder.addCase( fetchWeather.pending, (state) => {
      state.loadStatus = LOAD_STATUSES.LOADING;
    } );

    builder.addCase( fetchWeather.rejected, (state) => {
      state.loadStatus = LOAD_STATUSES.ERROR;
    } );

    builder.addCase( fetchWeather.fulfilled, (state, action) => {
      state.weatherInfo = action.payload;
      state.loadStatus = LOAD_STATUSES.LOADED;
    } );
  }
} );

export { slice };
export const actions = { ...sliceActions, fetchWeather };
