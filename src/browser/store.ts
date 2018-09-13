import idb from 'idb';
import uuid from 'uuid';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
//tslint:disable
import { composeWithDevTools } from 'redux-devtools-extension';
import { createRootReducer, rootSaga } from './store/index';
import { defaultContracts } from './contracts';

export default async function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const rootReducer = createRootReducer();
  const composeEnhancers = composeWithDevTools({});
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  await idb.open('scilla-ide', 2, async (upgradeDB) => {
    switch (upgradeDB.oldVersion) {
      case 0: {
        upgradeDB.createObjectStore('scilla-ide-fs');
        upgradeDB.createObjectStore('scilla-ide-blockchain');
        upgradeDB.createObjectStore('scilla-ide-contracts');
        break;
      }
    }

    const fs = upgradeDB.transaction.objectStore('scilla-ide-fs');
    defaultContracts.forEach(({ name, src }) => {
      const id = uuid();
      fs.add({ id, displayName: name, code: src }, id);
    });
  });

  sagaMiddleware.run(rootSaga);

  return store;
}
