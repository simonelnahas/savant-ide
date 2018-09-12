import React from 'react';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  delay: number;
  message: string;
}

export default class Loader extends React.Component<Props> {
  render() {
    return (
      <Wrapper>
        <Fade
          in
          style={{
            transitionDelay: `${this.props.delay}ms`,
          }}
          unmountOnExit
        >
          <React.Fragment>
            <CircularProgress />
            <Typography variant="body2">{this.props.message}</Typography>
          </React.Fragment>
        </Fade>
      </Wrapper>
    );
  }
}
