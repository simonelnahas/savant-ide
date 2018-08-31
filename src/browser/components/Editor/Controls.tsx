import * as React from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Toolbar from '@material-ui/core/Toolbar';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Typography from '@material-ui/core/Typography';
import Select from '../Form/Select';

import { Account } from '../../store/blockchain/types';
import { ContractSrcFile } from '../../store/fs/types';

const ButtonWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

const SelectWrapper = styled.div`
  min-width: 30%;
  max-width: 30%;
  margin: 0 1em;

  & > .root {
    margin: 0;
    width: 100%;
  }
`;

interface Props {
  accounts: { [address: string]: Account };
  activeAccount: Account | null;
  activeFile: ContractSrcFile;
  handleCheck: () => void;
  handleSave: () => void;
  handleSetCurrentAccount: React.ChangeEventHandler<HTMLSelectElement>;
}

export default class EditorControls extends React.Component<Props> {
  handleSave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleSave();
  };

  handleCheck: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleCheck();
  };

  getAccountOptions = () => {
    const { accounts } = this.props;

    return Object.keys(accounts).map((address) => ({
      key: `0x${address.toUpperCase()} (${accounts[address].balance.toString(10)}) ZIL`,
      value: address,
    }));
  };

  render() {
    const { activeAccount, activeFile, handleSetCurrentAccount } = this.props;
    const isContractSelected = !!activeFile.name.length;

    return (
      <Toolbar variant="dense">
        <Typography classes={{ root: 'filename' }}>
          {activeFile.name
            ? `${activeFile.name || 'untitled'}.scilla`
            : 'Create a new file, or select an existing one.'}
        </Typography>
        <SelectWrapper>
          <Select
            value={(activeAccount && activeAccount.address) || ''}
            placeholder="Select Account"
            onChange={handleSetCurrentAccount}
            items={this.getAccountOptions()}
          />
        </SelectWrapper>
        <ButtonWrapper>
          <IconButton
            disabled={!isContractSelected}
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
