import BN from 'bn.js';
import { createAction } from 'typesafe-actions';

import { BlockchainActionTypes } from './types';

export const adjustBalance = createAction(BlockchainActionTypes.ADJUST_BALANCE, (resolve) => {
  return (address: string, amount: BN) => resolve({ address, amount });
});
