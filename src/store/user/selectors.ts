import { Store } from './types';
import { RootStore } from '../rootStore';

const getUserSlice = (store: RootStore): Store => store.user;

export const getUserAuth = (store: RootStore): Store['isAuth'] =>
  getUserSlice(store).isAuth;

export const getUserName = (store: RootStore): Store['name'] =>
  getUserSlice(store).name;
