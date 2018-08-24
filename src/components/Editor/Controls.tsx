import * as React from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px;
`;

const ButtonWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

interface Props {
  handleSave: () => void;
}

export default class EditorControls extends React.Component<Props> {
  handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.handleSave();
  };

  render() {
    return (
      <Wrapper>
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
