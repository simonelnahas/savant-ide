import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import * as api from '../../util/api';
import Select from '../Form/Select';
import { ABI } from '../../store/contract/types';
import { ContractSrcFile } from '../../store/fs/types';
import InitForm, { Field } from './InitForm';

const Wrapper = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }
`;

interface Props {
  files: { [name: string]: ContractSrcFile };
}

interface State {
  error: string;
  isChecking: boolean;
  selected: string;
  abi: ABI | null;
  params: { [key: string]: Field };
}

export default class DeployTab extends React.Component<Props, State> {
  state: State = {
    selected: '',
    error: '',
    isChecking: false,
    abi: null,
    params: {},
  };

  onSelectContract: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    this.setState({ selected: e.target.value });
  };

  onDeploy = (initParams: { [key: string]: Field }) => {
    console.log('deploying with params: \n');
    console.log(initParams);
  };

  onChange = (initParams: { [key: string]: Field }) => {
    console.log('changed params: \n');
    console.log(initParams);
  };

  componentDidUpdate(_: Props, prevState: State) {
    if (prevState.selected !== this.state.selected) {
      const { code } = this.props.files[this.state.selected];
      const ctrl = new AbortController();
      this.setState({ isChecking: true });
      api
        .checkContract(code, ctrl.signal)
        .then((res) => {
          this.setState({ isChecking: false, abi: JSON.parse(res.message) });
        })
        .catch((err) => {
          this.setState({ error: err.response.message });
        });
    }
  }

  render() {
    const { files } = this.props;
    const { abi, error, selected } = this.state;
    const options = Object.keys(files).map((name) => ({
      key: name,
      value: name,
    }));

    return (
      <Wrapper>
        <Select
          placeholder="Choose a file."
          items={options}
          value={selected}
          onChange={this.onSelectContract}
        />
        {error.length ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : (
          abi && (
            <InitForm
              handleSubmit={this.onDeploy}
              handleChange={this.onChange}
              params={abi.params}
            />
          )
        )}
      </Wrapper>
    );
  }
}
