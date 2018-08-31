import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { find } from 'ramda';
import styled from 'styled-components';

import { Account } from '../../store/blockchain/types';
import { Contract, Transition, TransitionParams } from '../../store/contract/types';
import Select, { Option } from '../Form/Select';
import TransitionForm from './TransitionForm';

interface Props {
  // the address of a deployed contract
  callTransition: (address: string, sender: Account, params: TransitionParams) => void;
  activeAccount: Account | null;
  deployedContracts: { [address: string]: Contract };
}

interface State {
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

export default class CallTab extends React.Component<Props> {
  state: State = {
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

  getDeployedContractOptions = (): Option[] => {
    const { deployedContracts } = this.props;
    console.log(deployedContracts);

    return Object.keys(deployedContracts).map((address) => {
      const contract = deployedContracts[address];
      const key = `${address} (${(contract.abi && contract.abi.name) || ''})`;
      const value = address;
      return { key, value };
    });
  };

  onCallTransition = (transition: string, params: { [p: string]: any }) => {
    console.log(`Calling transition ${transition}`);
    console.log('Parameters: ', params);
    const { activeAccount } = this.props;
    const { selectedContract } = this.state;
    this.props.callTransition(
      selectedContract,
      activeAccount as Account,
      params as TransitionParams,
    );
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

  render() {
    const { deployedContracts } = this.props;
    const { selectedContract, selectedTransition } = this.state;
    const toCall = deployedContracts[selectedContract] || null;
    const abi = toCall && toCall.abi;

    return (
      <Wrapper>
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
