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
    width: 100%;
  }
`;

import App from './App';
import registerServiceWorker from './registerServiceWorker';

createStore({}).then((store) => {
  ReactDOM.render(<App store={store} />, document.getElementById('root') as HTMLElement);
});

registerServiceWorker();
