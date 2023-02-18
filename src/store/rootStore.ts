import { createStore, combineReducers} from 'redux';
import { composeWithDevTools } from "@redux-devtools/extension";
import { reducer as userReducer } from './user';
import { reducer as weatherReducer } from './weather';
import { reducer as locationReducer } from './location';

const rootReducer = combineReducers({
  user: userReducer,
  weather: weatherReducer,
  location: locationReducer,
});

export const store = createStore(rootReducer, composeWithDevTools());

export type RootStore = ReturnType<typeof store.getState>;
