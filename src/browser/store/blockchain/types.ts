/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pvt. Ltd.
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

export interface Account {
  address: string;
  balance: string;
  nonce: number;
}

export interface BlockchainState {
  error: any;
  loading: boolean;
  blockNum: number;
  accounts: { [address: string]: Account };
}

export const enum BlockchainActionTypes {
  INIT = '@blockchain/INIT',
  INIT_SUCCESS = '@blockchain/INIT_SUCCESS',
  INIT_ERROR = '@blockchain/INIT_ERROR',
  UPDATE_BNUM = '@blockchain/UPDATE_BNUM',
  UPDATE_ACCOUNT = '@blockchain/UPDATE_ACCOUNT',
  UPDATE_ACCOUNT_SUCCESS = '@blockchain/UPDATE_ACCOUNT_SUCCESS',
  UPDATE_ACCOUNT_ERROR = '@blockchain/UPDATE_ACCOUNT_ERROR',
}
