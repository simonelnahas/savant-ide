import { createAction } from 'typesafe-actions';

import { FSActionTypes, ContractSrcFile } from './types';

export const init = createAction(FSActionTypes.INIT);
export const initSuccess = createAction(FSActionTypes.INIT_SUCCESS, (resolve) => {
  return (contracts: ContractSrcFile[]) => resolve({ contracts });
});
export const initError = createAction(FSActionTypes.INIT_ERROR);

export const setSelectedContract = createAction(FSActionTypes.SET_SELECTED_CONTRACT, (resolve) => {
  return (id: string) => resolve({ id });
});

/**
 * Creation actions. These add files to the FS store.
 */
export const add = createAction(FSActionTypes.ADD, (resolve) => {
  return (displayName: string, code: string) => resolve({ displayName, code });
});
export const addSuccess = createAction(FSActionTypes.ADD_SUCCESS, (resolve) => {
  return (id: string, displayName: string, code: string) => resolve({ id, displayName, code });
});
export const addError = createAction(FSActionTypes.ADD_ERROR, (resolve) => {
  return (err: string) => resolve({ error: err });
});

/**
 * Code checking actions
 */
export const check = createAction(FSActionTypes.CHECK, (resolve) => {
  return (code: string, cb?: (res: any) => void) => resolve({ code, cb });
});
export const checkSuccess = createAction(FSActionTypes.CHECK_SUCCESS);
export const checkError = createAction(FSActionTypes.CHECK_ERROR, (resolve) => {
  return (error: any) => resolve({ error });
});

/**
 * Update actions
 */
export const update = createAction(FSActionTypes.UPDATE, (resolve) => {
  return (id: string, displayName: string, code: string) =>
    resolve({
      id,
      displayName,
      code,
    });
});
export const updateSuccess = createAction(FSActionTypes.UPDATE_SUCCESS, (resolve) => {
  return (id: string, displayName: string, code: string) =>
    resolve({
      id,
      displayName,
      code,
    });
});
export const updateError = createAction(FSActionTypes.UPDATE_ERROR, (resolve) => {
  return (error: string) => resolve({ error });
});

/**
 * Delete actions
 */
export const deleteContract = createAction(FSActionTypes.DELETE, (resolve) => {
  return (id: string) => resolve({ id });
});
export const deleteContractSuccess = createAction(FSActionTypes.DELETE_SUCCESS, (resolve) => {
  return (id: string) => resolve({ id });
});
export const deleteContractError = createAction(FSActionTypes.DELETE_ERROR, (resolve) => {
  return (id: string) => resolve({ id });
});
