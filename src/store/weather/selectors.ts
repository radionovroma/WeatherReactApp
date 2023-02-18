import { Store } from './types';
import { RootStore } from '../rootStore';

const getWeatherSlice = (store: RootStore): Store => store.weather;

export const getWeather = (store: RootStore): Store['weatherInfo'] =>
  getWeatherSlice(store).weatherInfo;

export const getWeatherLoadStatus = (store: RootStore): Store['loadStatus'] =>
  getWeatherSlice(store).loadStatus;
