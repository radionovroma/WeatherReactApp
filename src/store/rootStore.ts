import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from "@redux-devtools/extension";
import Thunk from 'redux-thunk';
import { slice as userReducer } from './user';
import { slice as weatherReducer } from './weather';
import { slice as locationReducer } from './location';

const rootReducer = combineReducers( {
  user: userReducer,
  weather: weatherReducer,
  location: locationReducer,
} );

export const store = createStore(
  rootReducer,
  composeWithDevTools( applyMiddleware( Thunk ) )
);

export type RootState = ReturnType<typeof store.getState>;
