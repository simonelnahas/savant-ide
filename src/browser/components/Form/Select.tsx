import * as React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MUISelect, { SelectProps } from '@material-ui/core/Select';
import styled from 'styled-components';

import { Transition } from '../../store/contract/types';

interface Props extends SelectProps {
  contractName: string; // the contract's name
  transitions: Transition[];
  value: string; // index of transition in Transitions[]
}

const Control = styled(FormControl)`
  && {
    margin-bottom: 2em;
  }
`;

const Select: React.SFC<Props> = ({ contractName, transitions, ...rest }) => {
  return (
    <Control>
      <InputLabel>Select Transition:</InputLabel>
      <MUISelect {...rest}>
        <MenuItem value="">Select a Transition</MenuItem>
        {transitions.map((t) => {
          return (
            <MenuItem key={t.name} value={t.name}>
              {t.name}
            </MenuItem>
          );
        })}
      </MUISelect>
    </Control>
  );
};

export default Select;
