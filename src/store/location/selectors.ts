import { Store } from './types';
import { RootStore } from '../rootStore';

const getLocationSlice = (store: RootStore): Store => store.location;

export const getCity = (store: RootStore): Store['city'] =>
  getLocationSlice(store).city;

export const getLocationLoadStatus = (store: RootStore): Store['loadStatus'] =>
  getLocationSlice(store).loadStatus;
