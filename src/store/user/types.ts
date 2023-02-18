export interface Store {
  isAuth: boolean;
  name: string;
}

export enum ACTION_TYPES {
  LOGIN = 'USER/LOGIN',
  INPUT_NAME = 'USER/INPUT_NAME',
}

export type LoginAction = {
  type: ACTION_TYPES.LOGIN;
};

export type InputName = {
  type: ACTION_TYPES.INPUT_NAME;
  payload: string;
}

export type Action = LoginAction | InputName;
