import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
//tslint:disable
import { composeWithDevTools } from 'redux-devtools-extension';
import { History } from 'history';
import { createRootReducer, rootSaga } from './store/index';

export default function configureStore(history: History, initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const rootReducer = createRootReducer();
  const composeEnhancers = composeWithDevTools({});
  const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
