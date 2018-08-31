export interface Account {
  address: string;
  balance: string;
  nonce: number;
}

export interface BlockchainState {
  error: any;
  loading: boolean;
  blockNum: number;
  current: string;
  accounts: { [address: string]: Account };
}

export const enum BlockchainActionTypes {
  INIT = '@blockchain/INIT',
  INIT_SUCCESS = '@blockchain/INIT_SUCCESS',
  INIT_ERROR = '@blockchain/INIT_ERROR',
  UPDATE_ACCOUNT = '@blockchain/UPDATE_ACCOUNT',
  UPDATE_ACCOUNT_SUCCESS = '@blockchain/UPDATE_ACCOUNT_SUCCESS',
  UPDATE_ACCOUNT_ERROR = '@blockchain/UPDATE_ACCOUNT_ERROR',
  SET_CURRENT_ACCOUNT = '@blockchain/SET_CURRENT_ACCOUNT',
}
