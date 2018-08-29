import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import fsReducer from './fs/reducer';
import fsSaga from './fs/saga';
import { FSState } from './fs/types';

import contractReducer from './contract/reducer';
import contractSaga from './contract/saga';
import { Contract as ContractState } from './contract/types';

export interface ApplicationState {
  fs: FSState;
  contract: ContractState;
}

export const createRootReducer = () => {
  return combineReducers<ApplicationState>({
    fs: fsReducer,
    contract: contractReducer,
  });
};

export function* rootSaga() {
  yield all([fork(fsSaga), fork(contractSaga)]);
}
