import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLocation } from '../../api';
import { fetchWeather } from '../weather';
import { LOAD_STATUSES } from '../../types/loadStatuses';

export interface State {
  city: string;
  loadStatus: LOAD_STATUSES;
}

const SLICE_NAME = 'location';

const initialState: State = {
  city: 'Moscow',
  loadStatus: LOAD_STATUSES.UNKNOWN
};

export const fetchLocation = createAsyncThunk(
  SLICE_NAME,
  (unit: string, thunkAPI) => {
    const cityPromise = getLocation();
    cityPromise.then( (location) => thunkAPI.dispatch( fetchWeather( { city: location.city, unit } ) as any ) )
    return cityPromise;
  } );

export const { reducer: slice } = createSlice( {
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase( fetchLocation.pending, (state) => {
      state.loadStatus = LOAD_STATUSES.LOADING;
    } );

    builder.addCase( fetchLocation.rejected, (state) => {
      state.loadStatus = LOAD_STATUSES.ERROR;
    } );

    builder.addCase( fetchLocation.fulfilled, (state, action) => {
      state.city = action.payload.city;
      state.loadStatus = LOAD_STATUSES.LOADED;
    } );
  }
} );
