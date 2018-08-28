import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import fsReducer from './fs/reducer';
import fsSaga from './fs/saga';
import { FSState } from './fs/types';

export interface ApplicationState {
  fs: FSState;
}

export const createRootReducer = () => {
  return combineReducers<ApplicationState>({
    fs: fsReducer,
  });
};

export function* rootSaga() {
  yield all([fork(fsSaga)]);
}
