import { all, actionChannel, select, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import hash from 'hash.js';
import BN from 'bn.js';

import { ApplicationState } from '../index';
import ContractStore from '../../database/contracts';
import * as contractActions from './actions';
import { ContractActionTypes, DeploymentStatus } from './types';

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
  const chan = yield actionChannel([ContractActionTypes.DEPLOY, ContractActionTypes.CALL]);
  while (true) {
    const action: ContractAction = yield take<ContractAction>(chan);
    // call the appropriate actions, passing the instance of db along
    switch (action.type) {
      case ContractActionTypes.DEPLOY:
        yield call(deployContract, action, db);
        break;
      case ContractActionTypes.CALL:
        yield call(callTransition, action, db);
        break;
      default:
    }
  }
}

function* deployContract(action: ActionType<typeof contractActions.deploy>, db: ContractStore) {
  try {
    const { code, deployer, init, statusCB } = action.payload;
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
      abi: JSON.parse(abi),
      balance: new BN(0),
      code,
      init,
      state: '[]',
      address,
    };

    yield db.set(address, contract);
    yield all([
      put(bcActions.updateAccount(updatedAccount)),
      yield put(contractActions.deploySuccess(contract)),
    ]);

    statusCB({ status: DeploymentStatus.SUCCESS, address });
  } catch (err) {
    yield put(contractActions.deployError(err));
    action.payload.statusCB({ status: DeploymentStatus.FAILURE, address: '' });
  }
}

function* callTransition(action: ActionType<typeof contractActions.call>, db: ContractStore) {
  const { address, transition, caller, params } = action.payload;
  try {
    const appState: ApplicationState = yield select();
    const contractStorage = appState.contract.contracts[address];
    // get init params
    const init = contractStorage.init;
    // get previous state if any
    const state = contractStorage.state;
    // TODO: real blockchain state. mock for demo.
    // get blockchain state
    const blockchain = [{ vname: 'BLOCKNUMBER', type: 'BNum', value: '100' }];
    // get message
    const message = {
      _tag: transition,
      _amount: '0',
      _sender: caller.address,
      params,
    };

    const payload = {
      code: contractStorage.code,
      init: JSON.stringify(init),
      blockchain: JSON.stringify(blockchain),
      state: JSON.stringify(state),
      message: JSON.stringify(message),
    };

    console.log(payload);
    // const res = yield api.callContract({
    //   code: contractStorage.code,
    //   init,
    //   blockchain: [{ vname: 'BLOCKNUMBER', type: 'BNum', value: '100' }],
    //   state,
    //   message,
    // });
    const res = yield api.callContract(payload);

    const { message: msg, states: newState } = res;
    console.log(msg);
    console.log(newState);
  } catch (err) {
    console.log(err);
  }
}

export default function* contractSaga() {
  yield fork(initContract);
}
