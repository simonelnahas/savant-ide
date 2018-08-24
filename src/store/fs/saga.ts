import { Zilliqa } from 'zilliqa-js';
import { actionChannel, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';

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
  const chan = yield actionChannel([FSActionTypes.ADD, FSActionTypes.DELETE]);
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

export default function* fsSaga() {
  yield fork(initFs);
}
