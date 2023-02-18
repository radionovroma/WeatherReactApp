import {Action, ACTION_TYPES, Store} from './types';

const initialStore: Store = {
  isAuth: false,
  name: '',
}

export const reducer = (store: Store = initialStore, action: Action): Store => {
  switch (action.type) {
    case ACTION_TYPES.INPUT_NAME: {
      return { ...store, name: action.payload }
    }
    case ACTION_TYPES.LOGIN: {
      return { name: store.name.trim(), isAuth: true};
    }
    default: {
      return store;
    }
  }
};
