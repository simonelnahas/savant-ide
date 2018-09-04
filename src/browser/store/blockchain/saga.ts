import { actionChannel, call, fork, put, select, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { Zilliqa } from 'zilliqa-js';

import AccountStore from '../../database/accounts';
import * as bcActions from './actions';
import { Account, BlockchainActionTypes } from './types';
import { ApplicationState } from '../index';

const DEFAULT_ACCOUNT_FUNDS = '88888888';
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
  console.log('Accounts: \n');
  console.log(accounts);

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
