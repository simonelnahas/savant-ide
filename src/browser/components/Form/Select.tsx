/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import copy from 'copy-to-clipboard';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MUISelect, { SelectProps } from '@material-ui/core/Select';
import styled from 'styled-components';

export interface Option {
  value: string;
  key: string;
}

interface Props extends SelectProps {
  copyable?: boolean;
  placeholder: string; // the contract's name
  items: Option[];
  value: string; // index of transition in Transitions[]
}

interface State {
  isOpen: boolean;
}

const Control = styled(FormControl)`
  && {
    flex: 0 0 auto;
    margin-bottom: 2em;
  }
`;

export default class Select extends React.Component<Props, State> {
  state: State = { isOpen: false };

  onCopy: ((value: string) => React.MouseEventHandler<HTMLButtonElement>) = (value: string) => (
    e,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const matchAddress = /^(0x[0-9A-F]{40})/.exec(value);
    if (matchAddress) {
      copy(matchAddress[1]);
    } else {
      copy(value);
    }

    this.setState({ isOpen: false });
  };

  onOpenInput: React.ChangeEventHandler<any> = () => this.setState({ isOpen: true });

  onCloseInput: React.ChangeEventHandler<any> = () => this.setState({ isOpen: false });

  render() {
    const { placeholder, items, copyable = false, ...rest } = this.props;
    return (
      <Control classes={{ root: 'root' }}>
        <InputLabel>{placeholder}</InputLabel>
        <MUISelect
          {...rest}
          onOpen={this.onOpenInput}
          onClose={this.onCloseInput}
          open={this.state.isOpen}
        >
          {items.map((opt) => {
            return (
              <MenuItem key={opt.key} {...opt}>
                <span style={{ flex: '1 0 auto' }}>{opt.key}</span>
                {copyable && (
                  <IconButton onClick={this.onCopy(opt.key)}>
                    <FileCopyIcon />
                  </IconButton>
                )}
              </MenuItem>
            );
          })}
        </MUISelect>
      </Control>
    );
  }
}
