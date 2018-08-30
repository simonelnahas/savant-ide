import * as React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem, {  } from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MUISelect, { SelectProps } from '@material-ui/core/Select';
import styled from 'styled-components';

/* import { Transition } from '../../store/contract/types'; */

export interface Option {
  value: string;
  key: string;
}

interface Props extends SelectProps {
  placeholder: string; // the contract's name
  items: Option[];
  value: string; // index of transition in Transitions[]
}

const Control = styled(FormControl)`
  && {
    margin-bottom: 2em;
  }
`;

const Select: React.SFC<Props> = ({ placeholder, items, ...rest }) => {
  return (
    <Control>
      <InputLabel>{placeholder}</InputLabel>
      <MUISelect {...rest}>
        {items.map((opt) => {
          return (
            <MenuItem key={opt.key} {...opt}>
              {opt.key}
            </MenuItem>
          );
        })}
      </MUISelect>
    </Control>
  );
};

export default Select;
