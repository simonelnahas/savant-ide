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

export const enum ScillaBinStatus {
  SUCCESS,
  FAILURE,
}

export interface RunnerResult {
  status: ScillaBinStatus;
  gasUsed: number;
  gasPrice: number;
  address: string;
  error?: any;
}

export interface Param {
  name: string;
  type: string;
}

export interface Transition {
  name: string;
  params: Param[];
}

export interface ABI {
  name: string;
  fields: Param[];
  params: Param[];
  transitions: Transition[];
}

export interface ContractEvent {
  _eventname: string;
  params: KVPair[];
}

export interface ContractMessage {
  _accepted: string;
  _amount: string;
  _recipient: string;
  _tag: string;
  params: KVPair[];
}

export interface TransitionCallResponse {
  events: ContractEvent[];
  message: ContractMessage;
  gas_remaining: string;
  states: KVPair[];
}

export interface Contract {
  address: string;
  code: string;
  abi: ABI | null;
  init: KVPair[];
  state: KVPair[];
  previousStates: KVPair[][];
  eventLog: ContractEvent[];
  messageLog: ContractMessage[];
}

interface ContractPointer {
  address: string;
  isChecking: boolean;
  isExecuting: boolean;
}

export interface KVPair {
  vname: string;
  type: string;
  value: string;
}

export interface TransitionParams {
  name: string;
  blockchain: KVPair[];
  state: KVPair[];
  tParams: KVPair[];
}

export interface Event {
  address: string;
  name: string;
  event: { [key: string]: any };
}

export interface ContractState {
  isLoading: boolean;
  isCallingTransition: boolean;
  isDeployingContract: boolean;
  error: boolean;
  active: ContractPointer;
  contracts: {
    [address: string]: Contract;
  };
  events: { [id: string]: Event };
}

export const enum ContractActionTypes {
  INIT = '@contract/INIT',
  INIT_SUCCESS = '@contract/INIT_SUCCESS',
  INIT_ERROR = '@contract/INIT_ERROR',
  CHECK = '@contract/CHECK',
  CHECK_SUCCESS = '@contract/CHECK_SUCCESS',
  CHECK_ERROR = '@contract/CHECK_ERROR',
  DEPLOY = '@contract/DEPLOY',
  DEPLOY_SUCCESS = '@contract/DEPLOY_SUCCESS',
  DEPLOY_ERROR = '@contract/DEPLOY_ERROR',
  CALL = '@contract/CALL',
  CALL_SUCCESS = '@contract/CALL_SUCCESS',
  CALL_ERROR = '@contract/CALL_ERROR',
  ADD_EVENT = '@contract/ADD_EVENT',
  CLEAR_EVENT = '@contract/CLEAR_EVENT',
}
