/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pvt. Ltd.
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
import { ContractSrcFile } from '../store/fs/types';

const FS_STORE_NAME = 'scilla-ide-fs';

export default class FSStore implements KVStore<string, ContractSrcFile> {
  name: string = FS_STORE_NAME;
  db: Promise<DB>;
  constructor() {
    this.db = idb.open('scilla-ide');
  }

  async tx(mode: 'readonly' | 'readwrite' = 'readwrite') {
    const dbConn = await this.db;
    const transaction = await dbConn.transaction(FS_STORE_NAME, mode);
    const store = await transaction.objectStore<ContractSrcFile, string>(FS_STORE_NAME);

    return Promise.all([transaction, store]);
  }

  async get(id: string) {
    const [, store] = await this.tx();
    const contractObj = await store.get(id);

    return contractObj;
  }

  async getAll() {
    const [, store] = await this.tx();
    const contracts = await store.getAll();

    return contracts;
  }

  async set(id: string, data: ContractSrcFile) {
    const [, store] = await this.tx();
    return store.put(data, id);
  }

  async delete(id: string) {
    const [, store] = await this.tx();
    return store.delete(id);
  }

  async clear() {
    const [, store] = await this.tx();
    return store.clear();
  }

  async keys() {
    const [, store] = await this.tx();
    const keys: string[] = [];
    const iterator = store.iterateCursor || store.iterateKeyCursor;
    iterator((cursor) => {
      if (!cursor) {
        return;
      }

      keys.push(<string>cursor.key);
    });

    return keys;
  }
}
