import { State } from './slice';
import { RootState } from '../rootStore';

const getLocationSlice = (store: RootState): State => store.location;

export const getCity = (store: RootState): State['city'] =>
  getLocationSlice( store ).city;

export const getLocationLoadStatus = (store: RootState): State['loadStatus'] =>
  getLocationSlice( store ).loadStatus;
