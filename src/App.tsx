import * as React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import styled from 'styled-components';

import Navigator from './components/Navigator';
import ScillaEditor from './components/Editor';

const theme = createMuiTheme();

const Wrapper = styled.div`
  flex-grow: 1;
  z-index: 1;
  position: relative;
  display: flex;
  min-height: 100%;
  width: 100%;
`;

class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Wrapper className="App">
          <CssBaseline />
          <MuiThemeProvider theme={theme}>
            <Navigator files={[]} />
            <ScillaEditor />
          </MuiThemeProvider>
        </Wrapper>
      </React.Fragment>
    );
  }
}

export default App;
