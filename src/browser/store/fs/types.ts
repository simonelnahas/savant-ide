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

export const enum FSActionTypes {
  INIT = '@fs/INIT',
  INIT_SUCCESS = '@fs/INIT_SUCCESS',
  INIT_ERROR = '@fs/INIT_ERROR',
  ADD = '@fs/ADD',
  ADD_SUCCESS = '@fs/ADD_SUCCESS',
  ADD_ERROR = '@fs/ADD_ERROR',
  CHECK = '@fs/CHECK',
  CHECK_SUCCESS = '@fs/CHECK_SUCCESS',
  CHECK_ERROR = '@fs/CHECK_ERROR',
  UPDATE = '@fs/UPDATE',
  UPDATE_SUCCESS = '@fs/UPDATE_SUCCESS',
  UPDATE_ERROR = '@fs/UPDATE_ERROR',
  DELETE = '@fs/DELETE',
  DELETE_SUCCESS = '@fs/DELETE_SUCCESS',
  DELETE_ERROR = '@fs/DELETE_ERROR',
  SET_SELECTED_CONTRACT = '@fs/SET_SELECTED_CONTRACT',
}

export interface ContractSrcFile {
  id: string;
  displayName: string;
  code: string;
  error?: any;
}

export interface FSState {
  error: boolean;
  loading: boolean;
  contracts: { [key: string]: ContractSrcFile };
  activeContract: string;
}
