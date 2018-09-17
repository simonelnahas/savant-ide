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

import * as React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import styled from 'styled-components';

import Navigator from './components/Navigator';
import ScillaEditor from './components/Editor';
import Runner from './components/Runner';
import Footer from './components/Footer';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7cf4f3',
      main: '#42c1c0',
      dark: '#009090',
      contrastText: '#000000',
    },
    secondary: {
      light: '#2e4cb4',
      main: '#6977e7',
      dark: '#9ea6ff',
      contrastText: '#000000',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        /* background: 'linear-gradient(45deg, #42c1c0 30%, #6977e7 90%)', */
      },
    },
  },
});

const Wrapper = styled.div`
  flex-grow: 1;
  z-index: 1;
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

interface Props {
  store: Store<any>;
}

interface State {
  isRunnerOpen: boolean;
  isNavigatorOpen: boolean;
}

class App extends React.Component<Props, State> {
  state: State = {
    isRunnerOpen: true,
    isNavigatorOpen: true,
  };

  toggleRunner = () => {
    this.setState({ isRunnerOpen: !this.state.isRunnerOpen });
  };

  toggleNavigator = () => {
    this.setState({ isNavigatorOpen: !this.state.isNavigatorOpen });
  };

  render() {
    return (
      <Provider store={this.props.store}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Wrapper className="App">
            <Navigator toggle={this.toggleNavigator} isOpen={this.state.isNavigatorOpen} />
            <ScillaEditor />
            <Runner toggle={this.toggleRunner} isOpen={this.state.isRunnerOpen} />
          </Wrapper>
          <Footer />
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
