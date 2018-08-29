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
  fields: Param[];
  transitions: Transition[];
}

export interface Contract {
  isChecking: boolean;
  isExecuting: boolean;
  balance: BN;
  code: string;
  abi: ABI | null;
  state: any;
}

export const enum ContractActionTypes {
  CHECK = '@contract/CHECK',
  CHECK_SUCCESS = '@contract/CHECK_SUCCESS',
  CHECK_ERROR = '@contract/CHECK_ERROR',
}

