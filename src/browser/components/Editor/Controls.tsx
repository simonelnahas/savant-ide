import * as React from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Toolbar from '@material-ui/core/Toolbar';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Typography from '@material-ui/core/Typography';

import EventAlerts from './EventAlerts';
import { clearEvent } from '../../store/contract/actions';
import { Event } from '../../store/contract/types';
import { ContractSrcFile } from '../../store/fs/types';

const ButtonWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

interface Props {
  activeFile: ContractSrcFile;
  blockNum: number;
  events: { [id: string]: Event };
  clearEvent: typeof clearEvent;
  canSave: boolean;
  handleCheck: () => void;
  handleSave: () => void;
}

export default class EditorControls extends React.Component<Props> {
  handleSave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleSave();
  };

  handleCheck: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleCheck();
  };

  render() {
    const { activeFile } = this.props;
    const isContractSelected = !!activeFile.name.length;

    return (
      <Toolbar variant="dense" style={{ padding: '12px 24px' }}>
        <Typography style={{ flex: 1 }}>
          {activeFile.name
            ? `${activeFile.name || 'untitled'}.scilla`
            : 'Create a new file, or select an existing one.'}
        </Typography>
        <Typography
          style={{ margin: '0 1em' }}
          variant="body2"
          color="textSecondary"
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
          <IconButton
            disabled={!isContractSelected}
            aria-label="save"
            color="primary"
            onClick={this.handleCheck}
          >
            <CheckBoxIcon />
          </IconButton>
          <Typography align="center" color="primary">
            Check
          </Typography>
        </ButtonWrapper>
        <ButtonWrapper>
          <EventAlerts clearEvent={this.props.clearEvent} events={this.props.events} />
          <Typography align="center" color="primary">
            Events
          </Typography>
        </ButtonWrapper>
      </Toolbar>
    );
  }
}
