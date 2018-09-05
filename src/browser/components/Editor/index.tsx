import * as React from 'react';
// @ts-ignore
import * as brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/theme/tomorrow';
import 'brace/mode/ocaml';
import 'brace/ext/searchbox';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Controls from './Controls';
import { ApplicationState } from '../../store/index';
import * as fsActions from '../../store/fs/actions';
import { ContractSrcFile } from '../../store/fs/types';

const Editor = styled(AceEditor)`
  .error-marker {
    position: absolute;
  }

  .error-marker:after {
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.5px;
    background: linear-gradient(45deg, transparent, transparent 49%, red 49%, transparent 51%);
  }
`;

const Wrapper = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

interface OwnProps {}
interface MappedProps {
  blocknum: number;
  contract: ContractSrcFile;
}

interface DispatchProps {
  check: typeof fsActions.check;
  update: typeof fsActions.update;
}

type Props = OwnProps & MappedProps & DispatchProps;

interface State {
  contract: ContractSrcFile;
}

class ScillaEditor extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    // a new contract has been loaded
    if (state.contract && state.contract.name !== props.contract.name) {
      return { ...state, contract: props.contract };
    }

    return null;
  }

  state: State = {
    contract: {
      name: '',
      code: '',
      error: null,
    },
  };

  handleCheck = () => {
    const { check } = this.props;
    const { contract } = this.state;
    check(contract.code);
  };

  handleSave = () => {
    const { update } = this.props;
    const { contract } = this.state;
    update(contract.name, contract.code);
  };

  onChange = (value: string): void => {
    this.setState({ contract: { ...this.state.contract, code: value } });
  };

  getAnnotations = (): any => {
    const { contract } = this.props;

    if (contract.error && contract.error.message) {
      const markers = contract.error.message.map((err: any) => {
        const row = parseInt(err.line, 10);
        const col = parseInt(err.column, 10);

        return {
          row: row === 0 ? 0 : row - 1,
          col,
          type: 'error',
          text: err.msg,
        };
      });

      return markers;
    }

    return [];
  };

  render() {
    const { contract } = this.state;

    return (
      <Wrapper>
        <Controls
          activeFile={contract}
          blockNum={this.props.blocknum}
          canSave={this.props.contract.code !== this.state.contract.code}
          handleCheck={this.handleCheck}
          handleSave={this.handleSave}
        />
        <Editor
          mode="ocaml"
          theme="tomorrow"
          fontSize={16}
          onChange={this.onChange}
          name="scilla-editor"
          annotations={this.getAnnotations()}
          editorProps={{ $blockScrolling: true }}
          style={{ flexGrow: 1, width: '100%', height: '' }}
          value={contract.code}
          readOnly={contract.name.length === 0}
        />
      </Wrapper>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  update: (name: string, code: string) => dispatch(fsActions.update(name, code)),
  check: (code: string) => dispatch(fsActions.check(code)),
});

const mapStateToProps = (state: ApplicationState) => ({
  blocknum: state.blockchain.blockNum,
  contract:
    state.fs.activeContract && state.fs.activeContract.length > 1
      ? state.fs.contracts[state.fs.activeContract]
      : { name: '', code: '' },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScillaEditor);
