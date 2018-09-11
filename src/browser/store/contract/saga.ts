import { all, actionChannel, select, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import hash from 'hash.js';
import BN from 'bn.js';

import { ApplicationState } from '../index';
import ContractStore from '../../database/contracts';
import * as contractActions from './actions';
import { ContractActionTypes, ScillaBinStatus } from './types';

import * as bcActions from '../blockchain/actions';
import * as api from '../../util/api';

const DEFAULT_DEPLOY_GAS = new BN(50);
const DEFAULT_CALL_GAS = new BN(10);

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
    const { code, deployer, init, msg, statusCB } = action.payload;
    const { message: abi } = yield api.checkContract(code);
    const state: ApplicationState = yield select();

    // we need to take this off the depoyer's balance
    const txAmount = new BN(msg._amount || '0');

    const updatedAccount = {
      ...deployer,
      nonce: deployer.nonce + 1,
      balance: new BN(deployer.balance)
        .sub(DEFAULT_DEPLOY_GAS)
        .sub(txAmount)
        .toString(10),
    };

    const address = hash
      .sha256()
      .update(updatedAccount.address + updatedAccount.nonce.toString())
      .digest('hex')
      .slice(-40);

    const contract = {
      abi: JSON.parse(abi),
      code,
      init: [
        ...init,
        { vname: '_creation_block', type: 'BNum', value: state.blockchain.blockNum.toString() },
      ],
      state: [{ vname: '_balance', type: 'Uint128', value: txAmount.toString() }],
      previousStates: [],
      eventLog: [],
      messageLog: [],
      address,
    };

    yield db.set(address, contract);
    yield all([
      put(bcActions.updateAccount(updatedAccount)),
      yield put(contractActions.deploySuccess(contract)),
    ]);

    statusCB({ status: ScillaBinStatus.SUCCESS, address });
  } catch (err) {
    yield put(contractActions.deployError(err));
    action.payload.statusCB({ status: ScillaBinStatus.FAILURE, address: '' });
  }
}

function* callTransition(action: ActionType<typeof contractActions.call>, db: ContractStore) {
  const { address, transition, tParams, msgParams, caller, gaslimit, statusCB } = action.payload;
  try {
    const state: ApplicationState = yield select();
    const contractStorage = state.contract.contracts[address];
    // get init params
    const init = contractStorage.init;
    // get previous state if any
    const contractState = contractStorage.state;
    // get blockchain state
    const blockchain = [
      { vname: 'BLOCKNUMBER', type: 'BNum', value: state.blockchain.blockNum.toString() },
    ];

    // we need to take this off the caller's balance
    const txAmount = new BN(msgParams._amount || '0');

    // get message
    const message = {
      _tag: transition,
      _amount: txAmount.toString(10),
      _sender: `0x${caller.address.toUpperCase()}`,
      params: tParams,
    };

    const payload = {
      code: contractStorage.code,
      init: JSON.stringify(init),
      blockchain: JSON.stringify(blockchain),
      state: JSON.stringify(contractState),
      message: JSON.stringify(message),
      gaslimit,
    };

    const res: api.CallResponse = yield api.callContract(payload);

    const { message: msg } = res;

    const updatedAccount = {
      ...caller,
      nonce: caller.nonce + 1,
      balance: new BN(caller.balance)
        .sub(DEFAULT_CALL_GAS)
        .sub(txAmount)
        .add(new BN(msg.message._amount))
        .toString(10),
    };

    const updatedContract: typeof contractStorage = {
      ...contractStorage,
      state: msg.states,
      previousStates: [...contractStorage.previousStates, contractStorage.state],
      eventLog: [...contractStorage.eventLog, ...msg.events],
      messageLog: [...contractStorage.messageLog, msg.message],
    };

    yield db.set(address, updatedContract);
    yield all([
      put(bcActions.updateAccount(updatedAccount)),
      yield put(contractActions.callSuccess(contractStorage.address, updatedContract)),
    ]);

    statusCB({ status: ScillaBinStatus.SUCCESS, address });
  } catch (err) {
    put(contractActions.callError(address, err));
    statusCB({ status: ScillaBinStatus.FAILURE, address, error: err });
  }
}

export default function* contractSaga() {
  yield fork(initContract);
}
