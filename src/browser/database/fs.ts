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
