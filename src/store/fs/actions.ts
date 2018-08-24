import { createAction } from 'typesafe-actions';

import { FSActionTypes, ContractSrcFile } from './types';

export const init = createAction(FSActionTypes.INIT);
export const initSuccess = createAction(FSActionTypes.INIT_SUCCESS, (resolve) => {
  return (contracts: ContractSrcFile[]) => resolve({ contracts });
});
export const initError = createAction(FSActionTypes.INIT_ERROR);

export const setSelectedContract = createAction(FSActionTypes.SET_SELECTED_CONTRACT, (resolve) => {
  return (address: string) => resolve({ address });
});

export const add = createAction(FSActionTypes.ADD, (resolve) => {
  return (name: string, code: string) => resolve({ name, code });
});
export const addSuccess = createAction(FSActionTypes.ADD_SUCCESS, (resolve) => {
  return (name: string, code: string, address: string) => resolve({ name, code, address });
});
export const addError = createAction(FSActionTypes.ADD_ERROR, (resolve) => {
  return (name: string, err: string) => resolve({ name, error: err });
});

export const update = createAction(FSActionTypes.UPDATE, (resolve) => {
  return (name: string, code: string, address: string) =>
    resolve({
      name,
      code,
      address,
    });
});
export const updateSuccess = createAction(FSActionTypes.UPDATE_SUCCESS, (resolve) => {
  return (name: string, code: string, address: string) =>
    resolve({
      name,
      code,
      address,
    });
});
export const updateError = createAction(FSActionTypes.UPDATE_ERROR, (resolve) => {
  return (error: string) =>
    resolve({ error });
});

export const deleteContract = createAction(FSActionTypes.DELETE, (resolve) => {
  return (address: string) => resolve({ address });
});
export const deleteContractSuccess = createAction(FSActionTypes.DELETE_SUCCESS, (resolve) => {
  return (address: string) => resolve({ address });
});
export const deleteContractError = createAction(FSActionTypes.DELETE_ERROR, (resolve) => {
  return (name: string) => resolve({ name });
});
