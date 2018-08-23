import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import { connectRouter, routerMiddleware } from 'connected-react-router';
//tslint:disable
import { composeWithDevTools } from 'redux-devtools-extension';
import { createRootReducer, rootSaga } from './store/index';

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const rootReducer = createRootReducer();
  const composeEnhancers = composeWithDevTools({});
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
