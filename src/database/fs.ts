import idb, { DB } from 'idb';
import { KVStore } from './types';

const FS_STORE_NAME = 'scilla-ide-fs';

interface ContractDataObject {
  name: string;
  hash: string;
  code: string;
}

export default class FSStore implements KVStore<string, ContractDataObject> {
  name: string = FS_STORE_NAME;
  db: Promise<DB>;
  constructor() {
    this.db = idb.open('scilla-ide', 1, (upgradeDB) => upgradeDB.createObjectStore(FS_STORE_NAME));
  }

  async tx(mode: 'readonly' | 'readwrite' = 'readwrite') {
    const dbConn = await this.db;
    const transaction = await dbConn.transaction(FS_STORE_NAME, mode);
    const store = await transaction.objectStore<ContractDataObject, string>(FS_STORE_NAME);

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

  async set(address: string, data: ContractDataObject) {
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
