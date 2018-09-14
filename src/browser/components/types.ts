import { Account } from '../store/blockchain/types';
import { RunnerResult, KVPair } from '../store/contract/types';
/**
 * Action dispatchers
 */
export type Deployer = (
  code: string,
  initParams: KVPair[],
  msgParams: { [key: string]: string },
  deployer: Account,
  gaslimit: number,
  gasprice: number,
  resultCb: (result: RunnerResult) => void,
) => void;

export type Caller = (
  address: string,
  transition: string,
  tParams: KVPair[],
  msgParams: { [key: string]: string },
  caller: Account,
  gaslimit: number,
  gasprice: number,
  resultCb: (result: RunnerResult) => void,
) => void;
