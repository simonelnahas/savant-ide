/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pvt. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
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
