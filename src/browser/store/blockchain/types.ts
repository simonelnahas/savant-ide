import BN from 'bn.js';

export interface Account {
  address: string;
  balance: BN;
}

export interface BlockchainState {
  error: any;
  loading: boolean;
  blockNum: number;
  accounts: { [address: string]: Account };
}

export const enum BlockchainActionTypes {
  ADJUST_BALANCE = '@@blockchain/ADJUST_BALANCE',
}
