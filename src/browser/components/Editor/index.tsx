/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pvt. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
// @ts-ignore
import * as brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/theme/tomorrow';
import './scilla_mode';
import 'brace/ext/searchbox';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Measure, { ContentRect } from 'react-measure';
import styled from 'styled-components';

import Controls from './Controls';
import Notification from './Notification';
import { ApplicationState } from '../../store/index';
import * as fsActions from '../../store/fs/actions';
import * as contractActions from '../../store/contract/actions';
import { ContractSrcFile } from '../../store/fs/types';
import { Event } from '../../store/contract/types';

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
  events: { [id: string]: Event };
}

interface DispatchProps {
  clearEvent: typeof contractActions.clearEvent;
  check: typeof fsActions.check;
  update: typeof fsActions.update;
}

type Props = OwnProps & MappedProps & DispatchProps;

interface State {
  contract: ContractSrcFile;
  isChecking: boolean;
  dimensions: { width: number; height: number };
  notifications: any[];
  snackbar: { open: boolean; message: any; key: number };
}

class ScillaEditor extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    // the contract has been deleted; clear state.
    if (!props.contract) {
      return { ...state, contract: { id: '', displayName: '', code: '' } };
    }

    // a new contract has been loaded.
    if (
      state.contract &&
      (state.contract.id !== props.contract.id ||
        state.contract.displayName !== props.contract.displayName)
    ) {
      return { ...state, contract: props.contract };
    }

    // the contract was checked, and an error occurred.
    if (state.contract && state.contract.error !== props.contract.error) {
      return { ...state, contract: { ...state.contract, error: props.contract.error } };
    }

    return null;
  }

  state: State = {
    contract: {
      id: '',
      displayName: '',
      code: '',
      error: null,
    },
    isChecking: false,
    dimensions: {
      height: -1,
      width: -1,
    },
    notifications: [],
    snackbar: { open: false, message: null, key: 0 },
  };

  handleCheck = () => {
    const { check } = this.props;
    const { contract } = this.state;
    this.setState({ isChecking: true });
    check(contract.code, this.handleCheckRes);
  };

  handleCheckRes = (res: any) => {
    this.setState((state) => ({
      notifications: state.notifications.concat([res]),
      isChecking: false,
    }));

    if (this.state.snackbar.open) {
      this.setState((state) => ({
        snackbar: { ...state.snackbar, open: false },
        isChecking: false,
      }));
      return;
    }

    this.handleDisplayNext();
  };

  handleCloseSnackbar = () => {
    this.setState({ snackbar: { ...this.state.snackbar, open: false } });
  };

  handleDisplayNext = () => {
    if (this.state.notifications.length) {
      const [head, ...tail] = this.state.notifications;

      this.setState({
        notifications: tail,
        snackbar: { open: true, message: head, key: new Date().getTime() },
      });

      return;
    }
  };

  handleSave = () => {
    const { update } = this.props;
    const { contract } = this.state;
    update(contract.id, contract.displayName, contract.code);
  };

  handleResize = (contentRect: ContentRect): void => {
    if (contentRect && contentRect.bounds) {
      const { height, width } = contentRect.bounds;
      this.setState({ dimensions: { height, width } });
    }
  };

  onChange = (value: string): void => {
    this.setState({ contract: { ...this.state.contract, code: value } });
  };

  getAnnotations = (): any => {
    const { contract } = this.state;

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
    const { contract, snackbar } = this.state;

    return (
      <Measure bounds onResize={this.handleResize}>
        {({ measureRef }) => (
          <Wrapper innerRef={measureRef}>
            <Notification
              key={snackbar.key}
              onClose={this.handleCloseSnackbar}
              onExited={this.handleDisplayNext}
              open={snackbar.open}
              msg={
                snackbar.message && snackbar.message.result === 'success'
                  ? 'Type-checking succeeded.'
                  : 'Type-checking failed.'
              }
              variant={snackbar.message && snackbar.message.result}
            />
            <Controls
              activeFile={contract}
              blockNum={this.props.blocknum}
              events={this.props.events}
              clearEvent={this.props.clearEvent}
              canSave={this.props.contract && this.props.contract.code !== this.state.contract.code}
              isChecking={this.state.isChecking}
              handleCheck={this.handleCheck}
              handleSave={this.handleSave}
            />
            <Editor
              mode="scilla"
              theme="tomorrow"
              fontSize={16}
              onChange={this.onChange}
              name="scilla-editor"
              annotations={this.getAnnotations()}
              height={`${this.state.dimensions.height.toString(10)}px`}
              width={`${this.state.dimensions.width.toString(10)}px`}
              value={contract.code}
              editorProps={{ $blockScrolling: true }}
              readOnly={contract.id.length === 0}
            />
          </Wrapper>
        )}
      </Measure>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  update: (id: string, displayName: string, code: string) =>
    dispatch(fsActions.update(id, displayName, code)),
  check: (code: string, cb?: (res: any) => void) => dispatch(fsActions.check(code, cb)),
  clearEvent: (id: string) => dispatch(contractActions.clearEvent(id)),
});

const mapStateToProps = (state: ApplicationState) => ({
  blocknum: state.blockchain.blockNum,
  contract:
    state.fs.activeContract && state.fs.activeContract.length > 1
      ? state.fs.contracts[state.fs.activeContract]
      : { id: '', displayName: '', code: '' },
  events: state.contract.events,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScillaEditor);
