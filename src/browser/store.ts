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
