/**
 * Copyright (c) 2018 Zilliqa
 * This source code is being disclosed to you solely for the purpose of your participation in 
 * testing Zilliqa. You may view, compile and run the code for that purpose and pursuant to 
 * the protocols and algorithms that are programmed into, and intended by, the code. You may 
 * not do anything else with the code without express permission from Zilliqa Research Pte. Ltd., 
 * including modifying or publishing the code (or any part of it), and developing or forming 
 * another public or private blockchain network. This source code is provided ‘as is’ and no 
 * warranties are given as to title or non-infringement, merchantability or fitness for purpose 
 * and, to the extent permitted by law, all liability for your use of the code is disclaimed. 
 * Some programs in this code are governed by the GNU General Public License v3.0 (available at 
 * https://www.gnu.org/licenses/gpl-3.0.en.html) (‘GPLv3’). The programs that are governed by 
 * GPLv3.0 are those programs that are located in the folders src/depends and tests/depends 
 * and which include a reference to GPLv3 in their program files.
 */

import { actionChannel, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import uuid from 'uuid';

import * as api from '../../util/api';
import * as fsActions from '../../store/fs/actions';
import { FSActionTypes } from '../../store/fs/types';
import FSStore from '../../database/fs';

type FsAction = ActionType<typeof fsActions>;

export function* initFs() {
  // instantiate a call to the virtual fs IDB store
  yield take(FSActionTypes.INIT);
  const db = new FSStore();

  // fetch all contracts on first load
  const contracts = yield db.getAll();
  yield put(fsActions.initSuccess(contracts));

  // block on _all_ actions
  const chan = yield actionChannel([
    FSActionTypes.ADD,
    FSActionTypes.DELETE,
    FSActionTypes.UPDATE,
    FSActionTypes.CHECK,
  ]);

  while (true) {
    const action: FsAction = yield take<FsAction>(chan);
    // call the appropriate actions, passing the instance of db along
    switch (action.type) {
      case FSActionTypes.ADD:
        yield call(createContract, action, db);
        break;
      case FSActionTypes.DELETE:
        yield call(deleteContract, action, db);
        break;
      case FSActionTypes.UPDATE:
        yield call(updateContract, action, db);
        break;
      case FSActionTypes.CHECK:
        yield call(checkContract, action);
        break;
      default:
    }
  }
}

function* createContract(action: ActionType<typeof fsActions.add>, db: FSStore) {
  try {
    const { displayName, code } = action.payload;
    const id = uuid();
    yield db.set(id, { ...action.payload, id });
    yield put(fsActions.addSuccess(id, displayName, code));
  } catch (err) {
    yield put(fsActions.addError(err));
  }
}

function* updateContract(action: ActionType<typeof fsActions.update>, db: FSStore) {
  try {
    const data = action.payload;
    yield db.set(data.id, data);
    yield put(fsActions.updateSuccess(data.id, data.displayName, data.code));
  } catch (err) {
    console.log(err);
  }
}

function* deleteContract(action: ActionType<typeof fsActions.deleteContract>, db: FSStore) {
  try {
    const { id } = action.payload;
    yield db.delete(id);
    yield put(fsActions.deleteContractSuccess(id));
  } catch (err) {
    yield put(fsActions.deleteContractError(err));
  }
}

function* checkContract(action: ActionType<typeof fsActions.check>) {
  try {
    const { code, cb } = action.payload;
    const res = yield api.checkContract(code);
    const { status, message } = res;

    if (status === api.Status.ERROR) {
      yield put(fsActions.checkError(message));
    } else {
      yield put(fsActions.checkSuccess());
    }

    if (cb) {
      cb(res);
    }
  } catch (err) {
    // something went wrong at the app level
    yield put(fsActions.checkError(err));

    if (action.payload.cb) {
      action.payload.cb(err.response);
    }
  }
}

export default function* fsSaga() {
  yield fork(initFs);
}
