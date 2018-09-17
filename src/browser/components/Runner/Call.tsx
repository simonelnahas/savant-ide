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
import { find } from 'ramda';
import styled from 'styled-components';

import { Account } from '../../store/blockchain/types';
import { RunnerResult, Contract, Transition } from '../../store/contract/types';
import Select, { Option } from '../Form/Select';
import { Caller } from '../types';
import { toMsgFields, toScillaParams, FieldDict, MsgFieldDict } from '../../util/form';
import TransitionForm from './TransitionForm';

const Wrapper = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  width: 100%;

  > * {
    width: 100%;
  }
`;

interface Props {
  // the address of a deployed contract
  callTransition: Caller;
  isCalling: boolean;
  accounts: { [address: string]: Account };
  deployedContracts: { [address: string]: Contract };
}

interface State {
  activeAccount: Account | null;
  result: RunnerResult | null;
  selectedContract: string; // address of currently selected transition
  selectedTransition: string;
}

export default class CallTab extends React.Component<Props, State> {
  state: State = {
    activeAccount: null,
    selectedContract: '',
    selectedTransition: '',
    result: null,
  };

  onCallTransition = (transition: string, params: FieldDict, msg: MsgFieldDict) => {
    const { callTransition } = this.props;
    const { activeAccount, selectedContract } = this.state;

    if (!activeAccount) {
      return;
    }

    const tParams = toScillaParams(params);
    const { gaslimit, gasprice, ...msgParams } = toMsgFields(msg);

    callTransition(
      selectedContract,
      transition,
      tParams,
      msgParams,
      activeAccount,
      gaslimit,
      gasprice,
      this.onCallResult,
    );
  };

  onCallResult = (result: RunnerResult) => this.setState({ result });

  onSelectAccount: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    this.setState({ activeAccount: this.props.accounts[e.target.value] });
  };

  onSelectContract: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    this.setState({ selectedContract: e.target.value });
  };

  onSelectTransition: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    this.setState({ selectedTransition: e.target.value });
  };

  getTransitionOptions = (): Option[] => {
    const { deployedContracts } = this.props;
    const { selectedContract } = this.state;

    const abi = deployedContracts[selectedContract].abi;

    if (abi && abi.transitions.length > 0) {
      return abi.transitions.map((transition) => {
        return { key: transition.name, value: transition.name };
      });
    }

    return [];
  };

  getDeployedContractOptions = (): Option[] => {
    const { deployedContracts } = this.props;

    return Object.keys(deployedContracts).map((address) => {
      const contract = deployedContracts[address];
      const key = `0x${address.toUpperCase()} (${(contract.abi && contract.abi.name) || ''})`;
      const value = address;
      return { key, value };
    });
  };

  getAccountOptions = () => {
    const { accounts } = this.props;

    return Object.keys(accounts).map((address) => ({
      key: `0x${address.toUpperCase()} (Balance: ${accounts[address].balance} ZIL, Nonce: ${
        accounts[address].nonce
      })`,
      value: address,
    }));
  };

  reset = () =>
    this.setState({
      activeAccount: null,
      selectedContract: '',
      selectedTransition: '',
      result: null,
    });

  render() {
    const { deployedContracts } = this.props;
    const { activeAccount, selectedContract, selectedTransition, result } = this.state;
    const toCall = deployedContracts[selectedContract] || null;
    const abi = toCall && toCall.abi;

    return (
      <Wrapper>
        <Select
          copyable
          value={(activeAccount && activeAccount.address) || ''}
          placeholder="Select account"
          onChange={this.onSelectAccount}
          items={this.getAccountOptions()}
        />
        <Select
          placeholder="Select a contract"
          items={this.getDeployedContractOptions()}
          value={selectedContract}
          onChange={this.onSelectContract}
        />
        {abi && (
          <React.Fragment>
            <Select
              placeholder={`Select a transition for ${abi.name}`}
              items={this.getTransitionOptions()}
              value={selectedTransition}
              onChange={this.onSelectTransition}
            />
            {activeAccount &&
              !!selectedTransition.length && (
                <TransitionForm
                  key={selectedTransition}
                  isCalling={this.props.isCalling}
                  handleReset={this.reset}
                  handleSubmit={this.onCallTransition}
                  result={result}
                  {...find((t) => t.name === selectedTransition, abi.transitions) as Transition}
                />
              )}
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}
