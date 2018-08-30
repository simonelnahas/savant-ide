import { createAction } from 'typesafe-actions';

import { ContractActionTypes, Contract } from './types';

/**
 * Initialisation
 * This boots up the main channel for communicatino with persistence layer
 */
export const init = createAction(ContractActionTypes.INIT);
export const initSuccess = createAction(ContractActionTypes.CHECK_SUCCESS, (resolve) => {
  return (contracts: Contract[]) => resolve({ contracts });
});
export const initError = createAction(ContractActionTypes.CHECK_ERROR, (resolve) => {
  return (error: string) => resolve({ error });
});

/**
 * Deployment actions
 */
export const deploy = createAction(ContractActionTypes.DEPLOY, (resolve) => {
  return (code: string, deployer: string, nonce: number) => resolve({ code, deployer, nonce });
});
export const deploySuccess = createAction(ContractActionTypes.DEPLOY_SUCCESS, (resolve) => {
  return (contract: Contract) => resolve({ contract });
});
export const deployError = createAction(ContractActionTypes.DEPLOY_ERROR, (resolve) => {
  return (error: string) => resolve({ error });
});
