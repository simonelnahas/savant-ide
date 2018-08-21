import { DB, ObjectStore, Transaction } from 'idb';

export interface KVStore<K = string, V = any> {
  name: string;
  db: Promise<DB>;
  tx(): Promise<[Transaction, ObjectStore<V, K>]>;
  get(key: K): Promise<V>;
  set(key: K, val: V): ReturnType<ObjectStore<V, K>['put']>;
  delete(key: K): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<K[]>;
}
