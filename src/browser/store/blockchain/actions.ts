/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
 */

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

export const updateBnum = createAction(
  BlockchainActionTypes.UPDATE_BNUM,
  (resolve) => (bnum: number) =>
    resolve({
      bnum,
    }),
);
export const updateBlkTime = createAction(
  BlockchainActionTypes.UPDATE_BLK_TIME,
  (resolve) => (interval: number) => resolve({ interval }),
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
