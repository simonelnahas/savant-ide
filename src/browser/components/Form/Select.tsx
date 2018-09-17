/**
 * Copyright (c) 2018 Zilliqa
 * This source code is being disclosed to you solely for the purpose of your participation in 
 * testing Zilliqa. You may view, compile and run the code for that purpose and pursuant to 
 * the protocols and algorithms that are programmed into, and intended by, the code. You may 
 * not do anything else with the code without express permission from Zilliqa Research Pte. Ltd., 
 * including modifying or publishing the code (or any part of it), and developing or forming 
 * another public or private blockchain network. This source code is provided ‘as is’ and no 
 * warranties are given as to title or non-infringement, merchantability or fitness for purpose 
 * and, to the extent permitted by law, all liability for your use of the code is disclaimed. 
 * Some programs in this code are governed by the GNU General Public License v3.0 (available at 
 * https://www.gnu.org/licenses/gpl-3.0.en.html) (‘GPLv3’). The programs that are governed by 
 * GPLv3.0 are those programs that are located in the folders src/depends and tests/depends 
 * and which include a reference to GPLv3 in their program files.
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
