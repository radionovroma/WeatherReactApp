import { State } from './slice';
import { RootState } from '../rootStore';

const getUserSlice = (store: RootState): State => store.user;

export const getUserAuth = (store: RootState): State['isAuth'] =>
  getUserSlice( store ).isAuth;

export const getUserName = (store: RootState): State['name'] =>
  getUserSlice( store ).name;
