import { createAction } from 'typesafe-actions';

import { Account, BlockchainActionTypes } from './types';

export const init = createAction(BlockchainActionTypes.INIT);
export const initSuccess = createAction(
  BlockchainActionTypes.INIT_SUCCESS,
  (resolve) => (accounts: { [address: string]: Account }) => resolve({ accounts }),
);
export const initError = createAction(BlockchainActionTypes.INIT_ERROR, (resolve) => (err: any) =>
  resolve({ error: err }),
);

export const updateAccount = createAction(BlockchainActionTypes.UPDATE_ACCOUNT, (resolve) => {
  return (account: Account) => resolve({ account });
});
export const updateAccountSuccess = createAction(
  BlockchainActionTypes.UPDATE_ACCOUNT_SUCCESS,
  (resolve) => {
    return (account: Account) => resolve({ account });
  },
);
export const updateAccountError = createAction(
  BlockchainActionTypes.UPDATE_ACCOUNT_ERROR,
  (resolve) => {
    return (err: any) => resolve({ error: err });
  },
);

