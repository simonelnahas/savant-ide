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

import { all, actionChannel, select, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import hash from 'hash.js';
import BN from 'bn.js';

import { ApplicationState } from '../index';
import ContractStore from '../../database/contracts';
import * as contractActions from './actions';
import { ContractActionTypes, ScillaBinStatus, ABI } from './types';

import * as bcActions from '../blockchain/actions';
import * as api from '../../util/api';

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
    const { code, deployer, init: pInit, msg, gaslimit, gasprice, statusCB } = action.payload;
    const { message: abi } = yield api.checkContract(code);
    if (!abi) {
      throw new Error('ABI could not be parsed.');
    }

    const state: ApplicationState = yield select();

    // we need to take this off the depoyer's balance
    const txAmount = new BN(msg._amount || '0');

    const address = hash
      .sha256()
      .update(deployer.address + (deployer.nonce + 1).toString())
      .digest('hex')
      .slice(-40);

    const init = [
      ...pInit,
      { vname: '_creation_block', type: 'BNum', value: state.blockchain.blockNum.toString() },
    ];

    const blockchain = [
      { vname: 'BLOCKNUMBER', type: 'BNum', value: state.blockchain.blockNum.toString() },
    ];

    const payload = {
      code,
      init: JSON.stringify(init),
      blockchain: JSON.stringify(blockchain),
      gaslimit,
    };

    const res = yield api.callContract(payload);

    const gasUsed = gaslimit - parseInt(res.message.gas_remaining, 10);

    const updatedAccount = {
      ...deployer,
      nonce: deployer.nonce + 1,
      balance: new BN(deployer.balance)
        .sub(txAmount)
        .sub(new BN(gasUsed * gasprice))
        .toString(10),
    };

    const contract = {
      abi: JSON.parse(abi),
      code,
      init,
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

    statusCB({ status: ScillaBinStatus.SUCCESS, address, gasUsed, gasPrice: gasprice });
  } catch (err) {
    yield put(contractActions.deployError(err));
    action.payload.statusCB({
      status: ScillaBinStatus.FAILURE,
      address: '',
      gasUsed: 0,
      gasPrice: action.payload.gasprice,
      error: err,
    });
  }
}

function* callTransition(action: ActionType<typeof contractActions.call>, db: ContractStore) {
  const {
    address,
    transition,
    tParams,
    msgParams,
    caller,
    gaslimit,
    gasprice,
    statusCB,
  } = action.payload;

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

    const gasUsed = gaslimit - parseInt(msg.gas_remaining, 10);

    const updatedAccount = {
      ...caller,
      nonce: caller.nonce + 1,
      balance: new BN(caller.balance)
        .sub(txAmount)
        .sub(new BN(gasUsed * gasprice))
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
      put(contractActions.callSuccess(contractStorage.address, updatedContract)),
      ...msg.events.map((event) =>
        put(
          contractActions.addEvent(
            contractStorage.address,
            (contractStorage.abi as ABI).name,
            event,
          ),
        ),
      ),
    ]);

    statusCB({ status: ScillaBinStatus.SUCCESS, address, gasUsed, gasPrice: gasprice });
  } catch (err) {
    put(contractActions.callError(address, err));
    statusCB({
      status: ScillaBinStatus.FAILURE,
      address,
      gasPrice: action.payload.gasprice,
      gasUsed: 0,
      error: err,
    });
  }
}

export default function* contractSaga() {
  yield fork(initContract);
}
