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
