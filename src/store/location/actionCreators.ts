import { Dispatch } from "redux";
import { getLocation } from "../../api";
import { fetchWeather, getWeatherStart } from "../weather";
import { ACTION_TYPES, GetLocationError, GetLocationStart, GetLocationSuccess } from "./types";

export const getLocationStart = (): GetLocationStart => ({
  type: ACTION_TYPES.GET_LOCATION_START
});

export const getLocationError = (): GetLocationError => ({
  type: ACTION_TYPES.GET_LOCATION_ERROR
});

export const getLocationSuccess = (city: string): GetLocationSuccess => ({
  type: ACTION_TYPES.GET_LOCATION_SUCCESS,
  payload: city
});

export const fetchLocation = (units: string) => (
  dispatch: Dispatch
) => {
  dispatch( getLocationStart() );
  getLocation()
    .then( (location) => {
      dispatch( (getLocationSuccess( location.city )) );
      dispatch(getWeatherStart());
      dispatch(fetchWeather(location.city, units) as any);
    } )
    .catch( () => {
      dispatch( getLocationError() );
    } );
};
