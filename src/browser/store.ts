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
