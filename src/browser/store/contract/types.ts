import BN from 'bn.js';

interface Param {
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
  transitions: Transition[];
}

export interface Contract {
  address: string;
  balance: BN;
  code: string;
  abi: ABI | null;
  state: any;
}

interface ContractPointer {
  address: string;
  isChecking: boolean;
  isExecuting: boolean;
}

export interface ContractState {
  isLoading: boolean;
  error: boolean;
  active: ContractPointer;
  contracts: {
    [address: string]: Contract;
  };
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
}
