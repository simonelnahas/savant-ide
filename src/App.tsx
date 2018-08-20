import * as React from 'react';
import ScillaEditor from './components/Editor';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">THIS. IS. SCILLAAAAAAAAAA</h1>
        </header>
        <ScillaEditor />
      </div>
    );
  }
}

export default App;
