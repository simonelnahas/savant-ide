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

import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import fsReducer from './fs/reducer';
import fsSaga from './fs/saga';
import { FSState } from './fs/types';

import contractReducer from './contract/reducer';
import contractSaga from './contract/saga';
import { ContractState } from './contract/types';

import blockchainReducer from './blockchain/reducer';
import blockchainSaga from './blockchain/saga';
import { BlockchainState } from './blockchain/types';

export interface ApplicationState {
  fs: FSState;
  contract: ContractState;
  blockchain: BlockchainState;
}

export const createRootReducer = () => {
  return combineReducers<ApplicationState>({
    fs: fsReducer,
    contract: contractReducer,
    blockchain: blockchainReducer,
  });
};

export function* rootSaga() {
  yield all([fork(fsSaga), fork(contractSaga), fork(blockchainSaga)]);
}
