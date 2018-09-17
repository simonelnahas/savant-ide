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

import { actionChannel, call, fork, put, select, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { Zilliqa } from 'zilliqa-js';

import AccountStore from '../../database/accounts';
import * as bcActions from './actions';
import { Account, BlockchainActionTypes } from './types';
import { ApplicationState } from '../index';

const DEFAULT_ACCOUNT_FUNDS = (10 ** 8).toString();
const DEFAULT_NUM_ACCOUNTS = 20;
const DEFAULT_BNUM_INTERVAL = 10000;
const util = new Zilliqa({ nodeUrl: 'https://localhost:8888' }).util;

type BlockchainAction = ActionType<typeof bcActions>;

const delay = (duration: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), duration));

export function* initBlockchain() {
  // instantiate a call to the virtual fs IDB store
  yield take(BlockchainActionTypes.INIT);
  const db = new AccountStore();
  const keys = yield db.keys();
  let accounts: { [address: string]: Account } = {};

  // generate new accounts if there are none
  if (!keys.length) {
    accounts = generateAccounts();
    const pending: Array<Promise<any>> = [];
    Object.keys(accounts).forEach((address) => {
      pending.push(db.set(address, accounts[address]));
    });

    yield Promise.all(pending);
  } else {
    // fetch all contracts on first load
    const accountsArr: Account[] = yield db.getAll();
    accounts = accountsArr.reduce((acc, account) => ({ ...acc, [account.address]: account }), <
      { [address: string]: Account }
    >{});
  }

  yield put(bcActions.initSuccess(accounts));

  // now start the bnum counter
  yield fork(blocknumCounter);

  // block on _all_ actions
  const chan = yield actionChannel([BlockchainActionTypes.UPDATE_ACCOUNT]);

  while (true) {
    const action: BlockchainAction = yield take<BlockchainAction>(chan);
    // call the appropriate actions, passing the instance of db along
    switch (action.type) {
      case BlockchainActionTypes.UPDATE_ACCOUNT:
        yield call(updateAccount, action, db);
        break;
      default:
    }
  }
}

const generateAccounts = () => {
  const accounts: { [address: string]: Account } = {};
  for (let i = 0; i < DEFAULT_NUM_ACCOUNTS; i++) {
    // @ts-ignore
    const privateKey = util.generatePrivateKey();
    // @ts-ignore
    const address = util.getAddressFromPrivateKey(privateKey);
    const account = { address, balance: DEFAULT_ACCOUNT_FUNDS, nonce: 0 };
    accounts[address] = account;
  }

  return accounts;
};

function* updateAccount(action: ActionType<typeof bcActions.updateAccount>, db: AccountStore) {
  const { account } = action.payload;
  try {
    yield db.set(account.address, account);
    yield put(bcActions.updateAccountSuccess(account));
  } catch (err) {
    yield put(bcActions.updateAccountError(err));
  }
}

function* blocknumCounter() {
  while (true) {
    try {
      yield call(delay, DEFAULT_BNUM_INTERVAL);
      const state: ApplicationState = yield select();
      yield put(bcActions.updateBnum(state.blockchain.blockNum + 1));
    } catch (err) {
      // ignore
    }
  }
}

export default function* blockchainSaga() {
  yield fork(initBlockchain);
}
