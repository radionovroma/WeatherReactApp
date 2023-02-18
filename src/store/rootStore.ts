import { createStore, combineReducers, applyMiddleware} from 'redux';
import { composeWithDevTools } from "@redux-devtools/extension";
import Thunk from 'redux-thunk';
import { reducer as userReducer } from './user';
import { reducer as weatherReducer } from './weather';
import { reducer as locationReducer } from './location';

const rootReducer = combineReducers({
  user: userReducer,
  weather: weatherReducer,
  location: locationReducer,
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(Thunk))
);

export type RootStore = ReturnType<typeof store.getState>;
