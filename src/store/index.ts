// import {all, fork} from 'redux-saga/effects';
import { combineReducers } from 'redux';
// reducers
import { blockchainReducer } from './blockchain/reducer';
// sagas
// import contractSaga from './contract/saga';
// import walletSaga from './wallet/saga';

// state interfaces for combination into RootState
import { BlockchainState } from './blockchain/types';

export interface ApplicationState {
  blockchain: BlockchainState;
}

export const createRootReducer = () => {
  return combineReducers<ApplicationState>({
    blockchain: blockchainReducer,
  });
};

// export function* rootSaga() {
//   yield all([fork(contractSaga), fork(walletSaga)]);
// }
