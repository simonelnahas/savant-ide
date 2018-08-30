import { actionChannel, call, fork, put, take } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import BN from 'bn.js';
import { Zilliqa } from 'zilliqa-js';

import AccountStore from '../../database/accounts';
import * as bcActions from './actions';
import { Account, BlockchainActionTypes } from './types';

const DEFAULT_ACCOUNT_FUNDS = new BN(88888888);
const DEFAULT_NUM_ACCOUNTS = 20;
const util = new Zilliqa({ nodeUrl: 'https://localhost:8888' }).util;

type BlockchainAction = ActionType<typeof bcActions>;

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
    accounts = yield db.getAll();
  }

  yield put(bcActions.initSuccess(accounts));

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

export default function* blockchainSaga() {
  yield fork(initBlockchain);
}
