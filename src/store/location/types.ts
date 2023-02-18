import { LOAD_STATUSES } from '../../types/loadStatuses';

export interface Store {
  city: string;
  loadStatus: LOAD_STATUSES;
}

export enum ACTION_TYPES {
  GET_LOCATION_START = "LOCATION/GET_LOCATION_START",
  GET_LOCATION_SUCCESS = "LOCATION/GET_LOCATION_SUCCESS",
  GET_LOCATION_ERROR = "LOCATION/GET_LOCATION_ERROR"
}

export type GetLocationStart = { type: ACTION_TYPES.GET_LOCATION_START };

export type GetLocationError = { type: ACTION_TYPES.GET_LOCATION_ERROR };

export type GetLocationSuccess = {
  type: ACTION_TYPES.GET_LOCATION_SUCCESS;
  payload: string;
};

export type Action = GetLocationStart | GetLocationError | GetLocationSuccess;
