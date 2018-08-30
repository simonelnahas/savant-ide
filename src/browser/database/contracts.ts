import idb, { DB } from 'idb';
import { KVStore } from './types';
import { Contract } from '../store/contract/types';

const CONTRACT_STORE_NAME = 'scilla-ide-contracts';

export default class ContractStore implements KVStore<string, Contract> {
  name: string = CONTRACT_STORE_NAME;
  db: Promise<DB>;
  constructor() {
    this.db = idb.open('scilla-ide');
  }

  async tx(mode: 'readonly' | 'readwrite' = 'readwrite') {
    const dbConn = await this.db;
    const transaction = await dbConn.transaction(this.name, mode);
    const store = await transaction.objectStore<Contract, string>(this.name);

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

  async set(address: string, data: Contract) {
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
