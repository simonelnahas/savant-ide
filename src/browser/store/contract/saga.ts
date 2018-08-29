import { put, takeEvery } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';

import * as contractActions from './actions';
import { ContractActionTypes } from './types';
import * as api from '../../util/api';

function* checkContract(action: ActionType<typeof contractActions.check>) {
  try {
    const { code } = action.payload;
    const { message } = yield api.checkContract(code);
    yield put(contractActions.checkSuccess(JSON.parse(message)));
  } catch (err) {
    yield put(contractActions.checkError(err));
  }
}

export default function* contractSaga() {
  yield takeEvery(ContractActionTypes.CHECK, checkContract);
}
