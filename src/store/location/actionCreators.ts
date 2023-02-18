import {ACTION_TYPES, GetLocationError, GetLocationStart, GetLocationSuccess} from "./types";

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
