import { WeatherInfo } from '../../types/weather';

import {
  ACTION_TYPES,
  GetWeatherError,
  GetWeatherStart,
  GetWeatherSuccess
} from "./types";

export const getWeatherStart = (): GetWeatherStart => ({
  type: ACTION_TYPES.GET_WEATHER_START
});

export const getWeatherError = (): GetWeatherError => ({
  type: ACTION_TYPES.GET_WEATHER_ERROR
});

export const getWeatherSuccess = (data: WeatherInfo): GetWeatherSuccess => ({
  type: ACTION_TYPES.GET_WEATHER_SUCCESS,
  payload: data
});
