import * as React from 'react';
// @ts-ignore
import * as brace from 'brace';
import AceEditor from 'react-ace';
import 'ayu-ace/light';
import 'brace/mode/ocaml';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import Controls from './Controls';
import { ApplicationState } from '../../store/index';
import * as fsActions from '../../store/fs/actions';
import { ContractSrcFile } from '../../store/fs/types';

interface OwnProps {}
interface MappedProps {
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

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

class ScillaEditor extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    // a new contract has been loaded
    if (!state.contract || state.contract.name !== props.contract.name) {
      return { ...state, contract: props.contract };
    }

    return null;
  }

  state: State = {
    contract: {
      name: '',
      code: '',
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

  render() {
    const { contract } = this.state;

    return (
      <Wrapper>
        <Controls contract={contract} handleCheck={this.handleCheck} handleSave={this.handleSave} />
        <AceEditor
          mode="ocaml"
          theme="ayu-light"
          fontSize={16}
          onChange={this.onChange}
          name="scilla-editor"
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
  contract:
    state.fs.activeContract && state.fs.activeContract.length > 1
      ? state.fs.contracts[state.fs.activeContract]
      : { name: '', code: '' },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScillaEditor);
