import idb from 'idb';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import { connectRouter, routerMiddleware } from 'connected-react-router';
//tslint:disable
import { composeWithDevTools } from 'redux-devtools-extension';
import { createRootReducer, rootSaga } from './store/index';

export default async function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const rootReducer = createRootReducer();
  const composeEnhancers = composeWithDevTools({});
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  await idb.open('scilla-ide', 1, (upgradeDB) => {
    upgradeDB.createObjectStore('scilla-ide-fs');
    upgradeDB.createObjectStore('scilla-ide-blockchain');
    upgradeDB.createObjectStore('scilla-ide-contracts');
  });

  sagaMiddleware.run(rootSaga);

  return store;
}
