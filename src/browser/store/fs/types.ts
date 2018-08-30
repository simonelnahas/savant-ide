export const enum FSActionTypes {
  INIT = '@fs/INIT',
  INIT_SUCCESS = '@fs/INIT_SUCCESS',
  INIT_ERROR = '@fs/INIT_ERROR',
  ADD = '@fs/ADD',
  ADD_SUCCESS = '@fs/ADD_SUCCESS',
  ADD_ERROR = '@fs/ADD_ERROR',
  CHECK = '@fs/CHECK',
  CHECK_SUCCESS = '@fs/CHECK_SUCCESS',
  CHECK_ERROR = '@fs/CHECK_ERROR',
  UPDATE = '@fs/UPDATE',
  UPDATE_SUCCESS = '@fs/UPDATE_SUCCESS',
  UPDATE_ERROR = '@fs/UPDATE_ERROR',
  DELETE = '@fs/DELETE',
  DELETE_SUCCESS = '@fs/DELETE_SUCCESS',
  DELETE_ERROR = '@fs/DELETE_ERROR',
  SET_SELECTED_CONTRACT = '@fs/SET_SELECTED_CONTRACT',
}

export interface ContractSrcFile {
  name: string;
  code: string;
}

export interface FSState {
  error: boolean;
  loading: boolean;
  contracts: { [key: string]: ContractSrcFile };
  activeContract: string;
}
