import { LOAD_STATUSES } from '../../types/loadStatuses';
import { WeatherInfo } from '../../types/weather';

export interface Store {
  weatherInfo: WeatherInfo | null;
  loadStatus: LOAD_STATUSES;
}

export enum ACTION_TYPES {
  GET_WEATHER_START = "WEATHER/GET_WEATHER_START",
  GET_WEATHER_SUCCESS = "WEATHER/GET_WEATHER_SUCCESS",
  GET_WEATHER_ERROR = "WEATHER/GET_WEATHER_ERROR"
}

export type GetWeatherStart = { type: ACTION_TYPES.GET_WEATHER_START };

export type GetWeatherError = { type: ACTION_TYPES.GET_WEATHER_ERROR };

export type GetWeatherSuccess = {
  type: ACTION_TYPES.GET_WEATHER_SUCCESS;
  payload: WeatherInfo;
};

export type Action = GetWeatherStart | GetWeatherError | GetWeatherSuccess;
