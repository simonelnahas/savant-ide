import * as React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import styled from 'styled-components';

import Navigator from './components/Navigator';
import ScillaEditor from './components/Editor';

interface Props {
  store: Store<any>;
}

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
        background: 'linear-gradient(45deg, #42c1c0 30%, #6977e7 90%)',
      },
    },
  },
});

const Wrapper = styled.div`
  flex-grow: 1;
  z-index: 1;
  position: relative;
  display: flex;
  min-height: 100%;
  max-height: 100%;
  height: 100%;
  width: 100%;
`;

class App extends React.Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <Wrapper className="App">
          <CssBaseline />
          <MuiThemeProvider theme={theme}>
            <Navigator />
            <ScillaEditor />
          </MuiThemeProvider>
        </Wrapper>
      </Provider>
    );
  }
}

export default App;
