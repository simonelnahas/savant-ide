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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import EventAlerts from './EventAlerts';
import { clearEvent } from '../../store/contract/actions';
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
  events: { [id: string]: Event };
  clearEvent: typeof clearEvent;
  isChecking: boolean;
  canSave: boolean;
  handleCheck: () => void;
  handleSave: () => void;
}

interface State {
  isNukeDialogOpen: boolean;
}

export default class EditorControls extends React.Component<Props, State> {
  state: State = {
    isNukeDialogOpen: false,
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

  render() {
    const { activeFile } = this.props;
    const isContractSelected = !!activeFile.displayName.length;

    return (
      <Toolbar variant="dense" style={{ padding: '12px 24px' }}>
        <Typography style={{ flex: 1 }}>
          {activeFile.displayName
            ? `${activeFile.displayName || 'untitled'}.scilla`
            : 'Create a new file, or select an existing one.'}
        </Typography>
        <Typography
          style={{ fontWeight: 500, margin: '0 1em' }}
          variant="subheading"
          color="primary"
          align="center"
        >{`Block Height: ${this.props.blockNum}`}</Typography>
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
      </Toolbar>
    );
  }
}
