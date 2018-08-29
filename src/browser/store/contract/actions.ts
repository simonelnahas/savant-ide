import { createAction } from 'typesafe-actions';

import { ContractActionTypes, ABI } from './types';

export const check = createAction(ContractActionTypes.CHECK, (resolve) => {
  return (code: string) => resolve({ code });
});
export const checkSuccess = createAction(ContractActionTypes.CHECK_SUCCESS, (resolve) => {
  return (abi: ABI) => resolve({ abi });
});
export const checkError = createAction(ContractActionTypes.CHECK_ERROR, (resolve) => {
  return (error: string) => resolve({ error });
});
