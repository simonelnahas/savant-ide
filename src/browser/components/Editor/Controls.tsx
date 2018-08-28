import * as React from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Typography from '@material-ui/core/Typography';

import { ContractSrcFile } from '../../store/fs/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 18px;

  & .filename {
    flex-grow: 1;
  }
`;

const ButtonWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

interface Props {
  contract: ContractSrcFile;
  handleCheck: () => void;
  handleSave: () => void;
}

export default class EditorControls extends React.Component<Props> {
  handleSave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleSave();
  };

  handleCheck: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleCheck();
  }

  render() {
    const { contract } = this.props;

    return (
      <Wrapper>
        <Typography classes={{ root: 'filename' }}>{`${contract.name}.scilla`}</Typography>
        <ButtonWrapper>
          <IconButton aria-label="save" color="primary" onClick={this.handleSave}>
            <SaveIcon />
          </IconButton>
          <Typography align="center" color="primary">
            Save
          </Typography>
        </ButtonWrapper>
        <ButtonWrapper>
          <IconButton aria-label="save" color="primary" onClick={this.handleCheck}>
            <CheckBoxIcon />
          </IconButton>
          <Typography align="center" color="primary">
            Check
          </Typography>
        </ButtonWrapper>
      </Wrapper>
    );
  }
}
