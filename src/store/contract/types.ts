import BN from 'bn.js';

export interface Contract {
  owner: string;
  balance: BN;
  code: string;
  fields: any;
  transitions: any;
}

