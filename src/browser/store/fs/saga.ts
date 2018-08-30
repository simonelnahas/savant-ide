import { Zilliqa } from 'zilliqa-js';
import { actionChannel, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';

import * as api from '../../util/api';
import * as fsActions from '../../store/fs/actions';
import { FSActionTypes } from '../../store/fs/types';
import FSStore from '../../database/fs';

type FsAction = ActionType<typeof fsActions>;

const util = new Zilliqa({ nodeUrl: '' }).util;

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
        yield call(checkContract, action, db);
        break;
      default:
    }
  }
}

function* createContract(action: ActionType<typeof fsActions.add>, db: FSStore) {
  try {
    const { name, code } = action.payload;
    // @ts-ignore
    const address = util.getAddressFromPrivateKey(util.generatePrivateKey());
    yield db.set(address, { ...action.payload, address });
    yield put(fsActions.addSuccess(name, code, address));
  } catch (err) {
    console.log(err);
    yield put(fsActions.addError(action.payload.name, err));
  }
}

function* updateContract(action: ActionType<typeof fsActions.update>, db: FSStore) {
  try {
    const data = action.payload;
    yield db.set(data.address, data);
    yield put(fsActions.updateSuccess(data.name, data.code, data.address));
  } catch (err) {
    console.log(err);
  }
}

function* deleteContract(action: ActionType<typeof fsActions.deleteContract>, db: FSStore) {
  try {
    const { address } = action.payload;
    yield db.delete(address);
    yield put(fsActions.deleteContractSuccess(address));
  } catch (err) {
    console.log(err);
    yield put(fsActions.deleteContractError(err));
  }
}

function* checkContract(action: ActionType<typeof fsActions.check>) {
  try {
    const { code } = action.payload;
    const res = yield api.checkContract(code);
    const { status, message } = res;
    console.log(res);
    if (status === 'error') {
      yield put(fsActions.checkError(message));
    } else {
      yield put(fsActions.checkSuccess());
    }
  } catch (err) {
    // something went wrong at the app level
    yield put(fsActions.checkError(err));
  }
}

export default function* fsSaga() {
  yield fork(initFs);
}
