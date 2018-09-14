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
