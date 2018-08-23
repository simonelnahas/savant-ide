import murmur from 'murmurhash3js';
import { actionChannel, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';

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
  const chan = yield actionChannel([FSActionTypes.ADD]);
  while (true) {
    const action = yield take<FsAction>(chan);
    // call the appropriate actions, passing the instance of db along
    yield call(createContract, action, db);
  }
}

function* createContract(action: ActionType<typeof fsActions.add>, db: FSStore) {
  try {
    const { name, code } = action.payload;
    const hash = murmur.x86.hash32(name.concat(code));
    yield db.set(hash, { ...action.payload, hash });
    yield put(fsActions.addSuccess(name, code, hash));
  } catch (err) {
    console.log(err);
    yield put(fsActions.addError(action.payload.name, err));
  }
}

export default function* fsSaga() {
  yield fork(initFs);
}
