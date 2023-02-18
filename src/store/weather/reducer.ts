import { Store, Action, ACTION_TYPES } from './types';
import { LOAD_STATUSES } from '../../types/loadStatuses';

const initialStore: Store = {
  weatherInfo: null,
  loadStatus: LOAD_STATUSES.UNKNOWN,
}

export const reducer = (store: Store = initialStore, action: Action): Store => {
  switch (action.type) {
    case ACTION_TYPES.GET_WEATHER_ERROR: {
      return { weatherInfo: null, loadStatus: LOAD_STATUSES.ERROR };
    }
    case ACTION_TYPES.GET_WEATHER_START: {
      return { ...store, loadStatus: LOAD_STATUSES.LOADING };
    }
    case ACTION_TYPES.GET_WEATHER_SUCCESS: {
      return { weatherInfo: action.payload, loadStatus: LOAD_STATUSES.LOADED };
    }
    default: {
      return store;
    }
  }
}
