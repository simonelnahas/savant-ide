import * as React from 'react';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import styled from 'styled-components';

export const Wrapper = styled.div`
  && {
    margin: 1em 8px;

    div {
      width: 100%;
    }
  }
`;

export default (props: FormControlProps) => (
  <Wrapper>
    <FormControl {...props} />
  </Wrapper>
);
