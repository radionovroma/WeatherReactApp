import { State } from './slice';
import { RootState } from '../rootStore';

const getWeatherSlice = (store: RootState): State => store.weather;

export const getWeather = (store: RootState): State['weatherInfo'] =>
  getWeatherSlice( store ).weatherInfo;

export const getWeatherLoadStatus = (store: RootState): State['loadStatus'] =>
  getWeatherSlice( store ).loadStatus;
