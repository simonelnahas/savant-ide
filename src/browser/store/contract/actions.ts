/**
 * Copyright (c) 2018 Zilliqa
 * This source code is being disclosed to you solely for the purpose of your participation in 
 * testing Zilliqa. You may view, compile and run the code for that purpose and pursuant to 
 * the protocols and algorithms that are programmed into, and intended by, the code. You may 
 * not do anything else with the code without express permission from Zilliqa Research Pte. Ltd., 
 * including modifying or publishing the code (or any part of it), and developing or forming 
 * another public or private blockchain network. This source code is provided ‘as is’ and no 
 * warranties are given as to title or non-infringement, merchantability or fitness for purpose 
 * and, to the extent permitted by law, all liability for your use of the code is disclaimed. 
 * Some programs in this code are governed by the GNU General Public License v3.0 (available at 
 * https://www.gnu.org/licenses/gpl-3.0.en.html) (‘GPLv3’). The programs that are governed by 
 * GPLv3.0 are those programs that are located in the folders src/depends and tests/depends 
 * and which include a reference to GPLv3 in their program files.
 */

import { createAction } from 'typesafe-actions';

import { ContractActionTypes, Contract, RunnerResult, KVPair } from './types';
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
    gaslimit: number,
    gasprice: number,
    statusCB: (result: RunnerResult) => void,
  ) => resolve({ code, init: initParams, msg: msgParams, gaslimit, gasprice, deployer, statusCB });
});
export const deploySuccess = createAction(ContractActionTypes.DEPLOY_SUCCESS, (resolve) => {
  return (contract: Contract) => resolve({ contract });
});
export const deployError = createAction(ContractActionTypes.DEPLOY_ERROR, (resolve) => {
  return (error: string) => resolve({ error });
});

/**
 * Transition actions
 */
export const call = createAction(ContractActionTypes.CALL, (resolve) => {
  return (
    address: string,
    transition: string,
    tParams: KVPair[],
    msgParams: { [key: string]: string },
    caller: Account,
    gaslimit: number,
    gasprice: number,
    statusCB: (result: RunnerResult) => void,
  ) => resolve({ address, transition, caller, tParams, msgParams, gaslimit, gasprice, statusCB });
});
export const callSuccess = createAction(ContractActionTypes.CALL_SUCCESS, (resolve) => {
  return (address: string, contract: Contract) => resolve({ address, contract });
});
export const callError = createAction(ContractActionTypes.CALL_ERROR, (resolve) => {
  return (address: string, error: any) => resolve({ address, error });
});

/**
 * Event actions
 */
export const addEvent = createAction(ContractActionTypes.ADD_EVENT, (resolve) => {
  return (address: string, name: string, event: { [key: string]: any }) =>
    resolve({ address, name, event });
});
export const clearEvent = createAction(ContractActionTypes.CLEAR_EVENT, (resolve) => {
  return (id: string) => resolve({ id });
});
