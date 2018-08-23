import * as React from 'react';
// tslint:disable-next-line
// @ts-ignore
import * as brace from 'brace';
import AceEditor from 'react-ace';
import 'ayu-ace/mirage';
import 'brace/mode/ocaml';
import { connect } from 'react-redux';

import { ApplicationState } from '../store/index';
import { ContractSrcFile } from '../store/fs/types';

interface OwnProps {}
interface MappedProps {
  contract: ContractSrcFile;
}

interface State {
  contract: ContractSrcFile;
}

type Props = OwnProps & MappedProps;

class ScillaEditor extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    // a new contract has been loaded
    if (state && state.contract && state.contract.hash !== props.contract.hash) {
      return { ...state, contract: props.contract };
    }

    return null;
  }

  state: State = {
    contract: {
      name: '',
      hash: '',
      code: '',
    },
  };

  onChange = (value: string): void => {
    this.setState({ contract: { ...this.state.contract, code: value } });
  };

  render() {
    const { contract } = this.state;

    return (
      <AceEditor
        mode="ocaml"
        theme="ayu-mirage"
        onChange={this.onChange}
        name="scilla-editor"
        editorProps={{ $blockScrolling: true }}
        style={{ flexGrow: 1, width: '100%', minHeight: '100%', height: '' }}
        value={contract.code}
      />
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  contract:
    state.fs.activeContract && state.fs.activeContract.length > 1
      ? state.fs.contracts[state.fs.activeContract]
      : { name: '', hash: '', code: '' },
});

export default connect(mapStateToProps)(ScillaEditor);
