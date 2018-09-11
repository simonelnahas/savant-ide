import { createAction } from 'typesafe-actions';

import { CallResult, ContractActionTypes, Contract, DeploymentResult, KVPair } from './types';
import { Account } from '../blockchain/types';

/**
 * Initialisation
 * This boots up the main channel for communicatino with persistence layer
 */
export const init = createAction(ContractActionTypes.INIT);
export const initSuccess = createAction(ContractActionTypes.INIT_SUCCESS, (resolve) => {
  return (contracts: Contract[]) => resolve({ contracts });
});
export const initError = createAction(ContractActionTypes.CHECK_ERROR, (resolve) => {
  return (error: string) => resolve({ error });
});

/**
 * Deployment actions
 */
export const deploy = createAction(ContractActionTypes.DEPLOY, (resolve) => {
  return (
    code: string,
    initParams: KVPair[],
    msgParams: { [key: string]: string },
    deployer: Account,
    statusCB: (result: DeploymentResult) => void,
  ) => resolve({ code, init: initParams, msg: msgParams, deployer, statusCB });
});
export const deploySuccess = createAction(ContractActionTypes.DEPLOY_SUCCESS, (resolve) => {
  return (contract: Contract) => resolve({ contract });
});
export const deployError = createAction(ContractActionTypes.DEPLOY_ERROR, (resolve) => {
  return (error: string) => resolve({ error });
});

export const call = createAction(ContractActionTypes.CALL, (resolve) => {
  return (
    address: string,
    transition: string,
    tParams: KVPair[],
    msgParams: { [key: string]: string },
    caller: Account,
    gaslimit: string,
    statusCB: (result: CallResult) => void,
  ) => resolve({ address, transition, caller, tParams, msgParams, gaslimit, statusCB });
});
export const callSuccess = createAction(ContractActionTypes.CALL_SUCCESS, (resolve) => {
  return (address: string, contract: Contract) => resolve({ address, contract });
});
export const callError = createAction(ContractActionTypes.CALL_ERROR, (resolve) => {
  return (address: string, error: any) => resolve({ address, error });
});
