import * as React from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Toolbar from '@material-ui/core/Toolbar';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Typography from '@material-ui/core/Typography';

import { ContractSrcFile } from '../../store/fs/types';

const ButtonWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

interface Props {
  activeFile: ContractSrcFile;
  blockNum: number;
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
      <Toolbar variant="dense">
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
        >{`Block: ${this.props.blockNum}`}</Typography>
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
      </Toolbar>
    );
  }
}
