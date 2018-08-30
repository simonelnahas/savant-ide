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
