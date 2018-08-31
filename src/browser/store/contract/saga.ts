import { all, actionChannel, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import hash from 'hash.js';
import BN from 'bn.js';

import ContractStore from '../../database/contracts';
import * as contractActions from './actions';
import { ContractActionTypes } from './types';

import * as bcActions from '../blockchain/actions';
import * as api from '../../util/api';

const DEFAULT_DEPLOY_GAS = new BN(50);

type ContractAction = ActionType<typeof contractActions>;

export function* initContract() {
  // instantiate a call to the virtual fs IDB store
  yield take(ContractActionTypes.INIT);
  const db = new ContractStore();

  // fetch all contracts on first load
  const contracts = yield db.getAll();
  yield put(contractActions.initSuccess(contracts));

  // block on _all_ actions
  const chan = yield actionChannel([ContractActionTypes.DEPLOY]);
  while (true) {
    const action: ContractAction = yield take<ContractAction>(chan);
    // call the appropriate actions, passing the instance of db along
    switch (action.type) {
      case ContractActionTypes.DEPLOY:
        yield call(deployContract, action, db);
        break;
      default:
    }
  }
}

function* deployContract(action: ActionType<typeof contractActions.deploy>, db: ContractStore) {
  try {
    const { code, deployer, init } = action.payload;
    const { message: abi } = yield api.checkContract(code);

    const updatedAccount = {
      ...deployer,
      nonce: deployer.nonce + 1,
      balance: new BN(deployer.balance).sub(DEFAULT_DEPLOY_GAS).toString(10),
    };

    const address = hash
      .sha256()
      .update(updatedAccount.address + updatedAccount.nonce.toString())
      .digest('hex')
      .slice(-40);

    const contract = {
      abi,
      balance: new BN(0),
      code,
      init,
      state: {},
      address,
    };

    yield db.set(address, contract);
    yield all([
      put(bcActions.updateAccount(updatedAccount)),
      yield put(contractActions.deploySuccess(contract)),
    ]);
  } catch (err) {
    yield put(contractActions.deployError(err));
  }
}

export default function* contractSaga() {
  yield fork(initContract);
}
