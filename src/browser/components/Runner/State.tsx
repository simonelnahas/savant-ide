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
import JSONTree from 'react-json-tree';
import styled from 'styled-components';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import Collapsible from './Collapsible';
import { Account } from '../../store/blockchain/types';
import { Contract } from '../../store/contract/types';
import { deserialiseContractState } from '../../util/encoding';

const noop = () => {
  return <React.Fragment />;
};

const labelRender = (key: string[]) => {
  return <span>{key.length > 1 ? key[0] : `0x${key[0].toUpperCase()}`}:</span>;
};

const valueRender = (value: string, ...args: any[]) => {
  if (args[1] === 'code') {
    const expander = (isOpen: boolean) => (
      <span style={{ color: '#000', cursor: 'pointer' }}>{isOpen ? 'hide' : 'show'}</span>
    );
    return (
      <Collapsible expander={expander}>
        {() => <code style={{ whiteSpace: 'pre' }}>{`\n${value}`}</code>}
      </Collapsible>
    );
  }

  return <span>{value}</span>;
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;

  > .tree-wrapper {
    margin: 1em 0;
  }

  > * ul {
    background: #ffffff;
    font-family: roboto;
    width: 100%;
  }
`;

const ToggleWrapper = styled(FormGroup)`
  margin-top: 1em;
  flex: 1 0 auto;
`;

interface Props {
  contracts: { [address: string]: Contract };
  accounts: { [address: string]: Account };
}

interface State {
  native: boolean;
}

export default class StateTree extends React.Component<Props, State> {
  state: State = { native: false };

  toggleNative = () => this.setState({ native: !this.state.native });

  getContracts = () => {
    const { contracts } = this.props;

    if (this.state.native) {
      return Object.keys(contracts).reduce((acc, address) => {
        return {
          ...acc,
          [address]: {
            ...contracts[address],
            init: deserialiseContractState(contracts[address].init),
            state: deserialiseContractState(contracts[address].state),
            stateLog: contracts[address].previousStates.map((state) =>
              deserialiseContractState(state),
            ),
          },
        };
      }, {});
    }

    return contracts;
  };

  render() {
    return (
      <Wrapper>
        <ToggleWrapper row>
          <FormControlLabel
            control={<Switch checked={this.state.native} onChange={this.toggleNative} />}
            label="Native Data Types"
          />
        </ToggleWrapper>
        <div className="tree-wrapper">
          <Typography variant="title">Contract State</Typography>
          <JSONTree
            hideRoot
            data={this.getContracts()}
            getItemString={noop}
            valueRenderer={valueRender}
            labelRenderer={labelRender}
          />
        </div>
        <div className="tree-wrapper">
          <Typography variant="title">Account State</Typography>
          <JSONTree
            hideRoot
            data={this.props.accounts}
            getItemString={noop}
            labelRenderer={labelRender}
          />
        </div>
      </Wrapper>
    );
  }
}
