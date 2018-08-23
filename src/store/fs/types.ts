export const enum FSActionTypes {
  INIT = '@fs/INIT',
  INIT_SUCCESS = '@fs/INIT_SUCCESS',
  INIT_ERROR = '@fs/INIT_ERROR',
  ADD = '@fs/ADD',
  ADD_SUCCESS = '@fs/ADD_SUCCESS',
  ADD_ERROR = '@fs/ADD_ERROR',
  SAVE = '@fs/SAVE',
  SAVE_SUCCESS = '@fs/SAVE_SUCCESS',
  SAVE_ERROR = '@fs/SAVE_ERROR',
  DELETE = '@fs/DELETE',
  DELETE_SUCCESS = '@fs/DELETE_SUCCESS',
  DELETE_ERROR = '@fs/DELETE_ERROR',
  SET_SELECTED_CONTRACT = '@fs/SET_SELECTED_CONTRACT',
}

export interface ContractSrcFile {
  name: string;
  code: string;
  hash: string; // murmur hash?
}

export interface FSState {
  error: boolean;
  loading: boolean;
  contracts: { [key: string]: ContractSrcFile };
  activeContract: string;
}
