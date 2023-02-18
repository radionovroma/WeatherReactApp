import {LOAD_STATUSES} from '../../types/loadStatuses';
import {Action, ACTION_TYPES, Store} from "./types";

const initialStore: Store = {
  city: 'Minsk',
  loadStatus: LOAD_STATUSES.UNKNOWN
}

export const reducer = (store: Store = initialStore, action: Action): Store => {
  switch (action.type) {
    case ACTION_TYPES.GET_LOCATION_START: {
      return { ...store, loadStatus: LOAD_STATUSES.LOADING };
    }
    case ACTION_TYPES.GET_LOCATION_ERROR: {
      return { ...store, loadStatus: LOAD_STATUSES.ERROR };
    }
    case  ACTION_TYPES.GET_LOCATION_SUCCESS: {
      return { city: action.payload, loadStatus: LOAD_STATUSES.LOADED};
    }
    default: {
      return store;
    }
  }
}
