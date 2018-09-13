export const enum ScillaBinStatus {
  SUCCESS,
  FAILURE,
}

export interface DeploymentResult {
  status: ScillaBinStatus;
  address: string;
  error?: any;
}

export interface CallResult {
  status: ScillaBinStatus;
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
