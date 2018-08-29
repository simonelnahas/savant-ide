import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { find } from 'ramda';
import styled from 'styled-components';

import { ABI, Transition } from '../../store/contract/types';
import Select from '../Form/Select';
import TransitionForm from './TransitionForm';
import Placeholder from '../Placeholder';

interface Props {
  abi: ABI;
}

interface State {
  transitionState: { [transition: string]: { [arg: string]: { value: any } } };
  selected: string; // index of currently selected transition
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
    selected: '',
  };

  onCallTransition = (transition: string, params: { [p: string]: any }) => {
    console.log(`Calling transition ${transition}`);
    console.log('Parameters: ', params);
  };

  onSelectTransition: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    this.setState({ selected: e.target.value });
  };

  onParameterChange = (transition: string, value: { [key: string]: { value: any } }) => {
    this.setState({
      parameters: { ...this.state.transitionState, [transition]: value },
    });
  };

  render() {
    const { abi } = this.props;
    const { selected } = this.state;

    return (
      <Wrapper>
        {abi ? (
          <React.Fragment>
            <Select
              contractName={abi.name}
              transitions={abi.transitions}
              value={selected}
              onChange={this.onSelectTransition}
            />
            {!!selected.length && (
              <React.Fragment>
                <Typography align="left" variant="subheading">
                  Parameters:
                </Typography>
                <TransitionForm
                  key={selected}
                  handleSubmit={this.onCallTransition}
                  handleChange={this.onParameterChange}
                  {...find((t) => t.name === selected, abi.transitions) as Transition}
                />
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <Placeholder>
            <Typography align="center" variant="headline">
              Please select a contract.
            </Typography>
          </Placeholder>
        )}
      </Wrapper>
    );
  }
}
