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
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import SettingsIcon from '@material-ui/icons/Settings';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { Keymap } from './index';
import EventAlerts from './EventAlerts';
import Settings from './Settings';
import { clearEvent } from '../../store/contract/actions';
import * as blockchainActions from '../../store/blockchain/actions';
import { Event } from '../../store/contract/types';
import { ContractSrcFile } from '../../store/fs/types';

const ButtonWrapper = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 0.3em;

  .nuke-btn {
    background-color: red;

    &:hover {
      background-color: red;
    }
  }
`;

interface Props {
  activeFile: ContractSrcFile;
  blockNum: number;
  blockTime: number;
  canSave: boolean;
  clearEvent: typeof clearEvent;
  events: { [id: string]: Event };
  fontSize: number;
  keyMap: Keymap;
  isChecking: boolean;
  getKeyboardShortcuts: () => Array<{ key: string; command: string }>;
  handleCheck: () => void;
  handleSave: () => void;
  handleSetFontSize: (size: number) => void;
  handleSetKeymap: (keymap: Keymap) => void;
  handleUpdateBlockNum: typeof blockchainActions.updateBnum;
  handleUpdateBlockTime: typeof blockchainActions.updateBlkTime;
}

interface State {
  isNukeDialogOpen: boolean;
  isSettingsDialogOpen: boolean;
}

export default class EditorControls extends React.Component<Props, State> {
  state: State = {
    isNukeDialogOpen: false,
    isSettingsDialogOpen: false,
  };

  handleSave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleSave();
  };

  handleCheck: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleCheck();
  };

  toggleNukeDialog = () => {
    this.setState({ isNukeDialogOpen: !this.state.isNukeDialogOpen });
  };

  handleNuke = () => {
    indexedDB.deleteDatabase('scilla-ide');
    document.location.reload();
  };

  toggleSettingsDialog = () => {
    this.setState({ isSettingsDialogOpen: !this.state.isSettingsDialogOpen });
  };

  render() {
    const { activeFile } = this.props;
    const isContractSelected = !!activeFile.displayName.length;

    return (
      <Toolbar variant="dense" style={{ padding: '12px 24px' }}>
        <ButtonWrapper>
          <IconButton
            disabled={!isContractSelected || !this.props.canSave}
            aria-label="save"
            color="primary"
            onClick={this.handleSave}
          >
            <SaveIcon />
          </IconButton>
          <Typography align="center" color="primary">
            Save
          </Typography>
        </ButtonWrapper>
        <ButtonWrapper>
          {this.props.isChecking ? (
            <CircularProgress style={{ padding: '12px' }} size={48} thickness={5} />
          ) : (
            <IconButton
              disabled={!isContractSelected}
              aria-label="check"
              color="primary"
              onClick={this.handleCheck}
            >
              <CheckBoxIcon />
            </IconButton>
          )}
          <Typography align="center" color="primary">
            {this.props.isChecking ? 'Checking' : 'Check'}
          </Typography>
        </ButtonWrapper>
        <ButtonWrapper>
          <EventAlerts clearEvent={this.props.clearEvent} events={this.props.events} />
          <Typography align="center" color="primary">
            Events
          </Typography>
        </ButtonWrapper>
        <ButtonWrapper>
          <IconButton aria-label="save" color="primary" onClick={this.toggleNukeDialog}>
            <RefreshIcon />
          </IconButton>
          <Typography align="center" color="primary">
            Reset
          </Typography>
        </ButtonWrapper>
        <ButtonWrapper>
          <IconButton aria-label="settings" color="primary" onClick={this.toggleSettingsDialog}>
            <SettingsIcon />
          </IconButton>
          <Typography align="center" color="primary">
            Settings
          </Typography>
        </ButtonWrapper>
        <Typography
          style={{ fontWeight: 500, flex: '1 0 auto', margin: '0 1em' }}
          variant="subheading"
          color="primary"
          align="right"
        >{`Block Height: ${this.props.blockNum}`}</Typography>
        <Dialog
          open={this.state.isNukeDialogOpen}
          onClose={this.toggleNukeDialog}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action will reset all state, including all your files, accounts, and deployments.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleNukeDialog} color="primary" variant="contained">
              Cancel
            </Button>
            <ButtonWrapper>
              <Button onClick={this.handleNuke} variant="contained" classes={{ root: 'nuke-btn' }}>
                Yes, Nuke.
              </Button>
            </ButtonWrapper>
          </DialogActions>
        </Dialog>
        <Settings
          blockNum={this.props.blockNum}
          blockTime={this.props.blockTime}
          fontSize={this.props.fontSize}
          keyMap={this.props.keyMap}
          getKeyboardShortcuts={this.props.getKeyboardShortcuts}
          handleSetFontSize={this.props.handleSetFontSize}
          handleSetKeymap={this.props.handleSetKeymap}
          handleUpdateBlockNum={this.props.handleUpdateBlockNum}
          handleUpdateBlockTime={this.props.handleUpdateBlockTime}
          isOpen={this.state.isSettingsDialogOpen}
          toggle={this.toggleSettingsDialog}
        />
      </Toolbar>
    );
  }
}
