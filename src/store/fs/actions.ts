import { createAction } from 'typesafe-actions';

import { FSActionTypes, ContractSrcFile } from './types';

export const init = createAction(FSActionTypes.INIT);
export const initSuccess = createAction(FSActionTypes.INIT_SUCCESS, (resolve) => {
  return (contracts: ContractSrcFile[]) => resolve({ contracts });
});
export const initError = createAction(FSActionTypes.INIT_ERROR);

export const add = createAction(FSActionTypes.ADD, (resolve) => {
  return (name: string, code: string) => resolve({ name, code });
});
export const addSuccess = createAction(FSActionTypes.ADD_SUCCESS, (resolve) => {
  return (name: string, code: string, hash: string) => resolve({ name, code, hash });
});
export const addError = createAction(FSActionTypes.ADD_ERROR, (resolve) => {
  return (name: string, err: string) => resolve({ name, error: err });
});

export const setSelectedContract = createAction(FSActionTypes.SET_SELECTED_CONTRACT, (resolve) => {
  return (name: string) => resolve({ name });
});
