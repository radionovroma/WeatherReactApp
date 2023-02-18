import {ACTION_TYPES, InputName, LoginAction} from './types';

export const login = (): LoginAction => ({
  type: ACTION_TYPES.LOGIN
});

export const inputName = (name: string): InputName => ({
  type: ACTION_TYPES.INPUT_NAME,
  payload: name,
});

