import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { find } from 'ramda';
import styled from 'styled-components';

import { Account } from '../../store/blockchain/types';
import { Contract, Transition, KVPair } from '../../store/contract/types';
import Select, { Option } from '../Form/Select';
import TransitionForm from './TransitionForm';

interface Props {
  // the address of a deployed contract
  callTransition: (address: string, transition: string, sender: Account, params: KVPair[]) => void;
  accounts: { [address: string]: Account };
  deployedContracts: { [address: string]: Contract };
}

interface State {
  activeAccount: Account | null;
  transitionState: { [transition: string]: { [arg: string]: { value: any } } };
  selectedContract: string; // address of currently selected transition
  selectedTransition: string;
}

const Wrapper = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }
`;

const toScillaParams = (fields: { [name: string]: { [key: string]: any } }): KVPair[] => {
  return Object.keys(fields).map((name) => {
    return { vname: name, value: fields[name].value, type: fields[name].type };
  });
};

export default class CallTab extends React.Component<Props> {
  state: State = {
    activeAccount: null,
    transitionState: {},
    selectedContract: '',
    selectedTransition: '',
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

  onCallTransition = (transition: string, params: { [p: string]: any }) => {
    console.log(`Calling transition ${transition}`);
    console.log('Parameters: ', params);
    const { activeAccount, selectedContract } = this.state;
    const tParams = toScillaParams(params);

    this.props.callTransition(selectedContract, transition, activeAccount as Account, tParams);
  };

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

  onParameterChange = (transition: string, value: { [key: string]: { value: any } }) => {
    this.setState({
      parameters: { ...this.state.transitionState, [transition]: value },
    });
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


  render() {
    const { deployedContracts } = this.props;
    const { activeAccount, selectedContract, selectedTransition } = this.state;
    const toCall = deployedContracts[selectedContract] || null;
    const abi = toCall && toCall.abi;

    return (
      <Wrapper>
        <Select
          value={(activeAccount && activeAccount.address) || ''}
          placeholder="Select Account"
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
              placeholder={abi.name}
              items={this.getTransitionOptions()}
              value={selectedTransition}
              onChange={this.onSelectTransition}
            />
            {!!selectedTransition.length && (
              <React.Fragment>
                <Typography align="left" variant="subheading">
                  Parameters:
                </Typography>
                <TransitionForm
                  key={selectedTransition}
                  handleSubmit={this.onCallTransition}
                  handleChange={this.onParameterChange}
                  {...find((t) => t.name === selectedTransition, abi.transitions) as Transition}
                />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}
