import * as React from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
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
  handleSave: () => void;
}

export default class EditorControls extends React.Component<Props> {
  handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleSave();
  };

  render() {
    const { contract } = this.props;

    return (
      <Wrapper>
        <Typography classes={{ root: 'filename' }}>{`${contract.name}.scilla`}</Typography>
        <ButtonWrapper>
          <IconButton aria-label="save" color="primary" onClick={this.handleClick}>
            <SaveIcon />
          </IconButton>
          <Typography align="center" color="primary">
            Save
          </Typography>
        </ButtonWrapper>
      </Wrapper>
    );
  }
}
