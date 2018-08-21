import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

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

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
