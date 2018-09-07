import * as React from 'react';
import { find } from 'ramda';
import styled from 'styled-components';

import { Account } from '../../store/blockchain/types';
import { CallResult, Contract, Transition } from '../../store/contract/types';
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
  accounts: { [address: string]: Account };
  deployedContracts: { [address: string]: Contract };
}

interface State {
  activeAccount: Account | null;
  result: CallResult | null;
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
    console.log(`Calling transition ${transition}`);
    console.log('Parameters: ', params);
    console.log('Msg: ', msg);
    const { callTransition } = this.props;
    const { activeAccount, selectedContract } = this.state;

    if (!activeAccount) {
      return;
    }

    const tParams = toScillaParams(params);
    const msgParams = toMsgFields(msg);

    callTransition(
      selectedContract,
      transition,
      tParams,
      msgParams,
      activeAccount,
      this.onCallResult,
    );
  };

  onCallResult = (result: CallResult) => this.setState({ result });

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
      const key = `${address} (${(contract.abi && contract.abi.name) || ''})`;
      const value = address;
      return { key, value };
    });
  };

  getAccountOptions = () => {
    const { accounts } = this.props;

    return Object.keys(accounts).map((address) => ({
      key: `0x${address.toUpperCase()} (${accounts[address].balance}) ZIL Nonce: ${
        accounts[address].nonce
      }`,
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
