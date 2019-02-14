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

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

import createStore from './store';

// @ts-ignore
// tslint:disable
injectGlobal`
  html {
    height: 100%;
  }

  body {
    display: flex;
    height: 100%;
  }

  & #root {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

import App from './App';
import registerServiceWorker from './registerServiceWorker';

createStore({}).then((store) => {
  ReactDOM.render(<App store={store} />, document.getElementById('root') as HTMLElement);
});

registerServiceWorker();
