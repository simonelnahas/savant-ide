/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
 */

import idb, { DB } from 'idb';
import { KVStore } from './types';
import { Account } from '../store/blockchain/types';

const BLOCKCHAIN_STORE_NAME = 'scilla-ide-blockchain';

export default class BlockchainStore implements KVStore<string, Account> {
  name: string = BLOCKCHAIN_STORE_NAME;
  db: Promise<DB>;
  constructor() {
    this.db = idb.open('scilla-ide');
  }

  async tx(mode: 'readonly' | 'readwrite' = 'readwrite') {
    const dbConn = await this.db;
    const transaction = await dbConn.transaction(this.name, mode);
    const store = await transaction.objectStore<Account, string>(this.name);

    return Promise.all([transaction, store]);
  }

  async get(address: string) {
    const [, store] = await this.tx();
    const contractObj = await store.get(address);

    return contractObj;
  }

  async getAll() {
    const [, store] = await this.tx();
    const contracts = await store.getAll();

    return contracts;
  }

  async set(address: string, data: Account) {
    const [, store] = await this.tx();
    return store.put(data, address);
  }

  async delete(address: string) {
    const [, store] = await this.tx();
    return store.delete(address);
  }

  async clear() {
    const [, store] = await this.tx();
    return store.clear();
  }

  async keys() {
    const [, store] = await this.tx();
    const keys = await store.getAllKeys();

    return keys;
  }
}
