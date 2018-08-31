import * as React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import * as api from '../../util/api';
import Select from '../Form/Select';
import { Account } from '../../store/blockchain/types';
import { ABI, DeploymentResult } from '../../store/contract/types';
import { ContractSrcFile } from '../../store/fs/types';
import InitForm, { Field } from './InitForm';

const Wrapper = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }
`;

const StatusWrapper = styled.div`
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    width: 100%;
    text-align: center;
  }
`;

interface Props {
  deployContract: (
    code: string,
    init: { [key: string]: any },
    deployer: Account,
    successCb: (result: DeploymentResult) => void,
  ) => void;
  activeAccount: Account;
  files: { [name: string]: ContractSrcFile };
}

interface State {
  error: string;
  isChecking: boolean;
  selected: string;
  abi: ABI | null;
  params: { [key: string]: Field };
  result: DeploymentResult | null;
}

export default class DeployTab extends React.Component<Props, State> {
  state: State = {
    selected: '',
    error: '',
    isChecking: false,
    abi: null,
    params: {},
    result: null,
  };

  onSelectContract: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ selected: e.target.value });
  };

  onDeploy = (initParams: { [key: string]: Field }) => {
    // dispatch deploy contract action
    const { deployContract, files, activeAccount } = this.props;
    const sourceFile = files[this.state.selected];
    console.log('deploying with params: \n');
    console.log(initParams);
    deployContract(sourceFile.code, this.state.params, activeAccount, this.onDeployResult);
  };

  onDeployResult = (result: DeploymentResult) => this.setState({ result });

  onChange = (initParams: { [key: string]: Field }) => {
    console.log('changed params: \n');
    console.log(initParams);
    this.setState({ params: initParams });
  };

  reset = () => {
    this.setState({
      selected: '',
      error: '',
      isChecking: false,
      abi: null,
      params: {},
      result: null,
    });
  };

  componentDidUpdate(_: Props, prevState: State) {
    if (prevState.selected !== this.state.selected && this.state.selected.length) {
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
    const { abi, error, selected, result } = this.state;
    const options = Object.keys(files).map((name) => ({
      key: name,
      value: name,
    }));

    if (result && result.status === 0) {
      return (
        <StatusWrapper>
          <Typography variant="body2">
            {`Your contract was successfully deployed to ${result.address}`}
          </Typography>
          <Button
            variant="extendedFab"
            aria-label="reset"
            onClick={this.reset}
            style={{ margin: '3.5em 0' }}
          >
            Reset
          </Button>
        </StatusWrapper>
      );
    }

    if (result && result.status === 1) {
      return (
        <StatusWrapper>
          <Typography color="error" variant="body2">
            Your contract could not be deployed.
          </Typography>
          <Button
            variant="extendedFab"
            aria-label="reset"
            onClick={this.reset}
            style={{ margin: '3.5em 0' }}
          >
            Try Again
          </Button>
        </StatusWrapper>
      );
    }

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
              key={abi.name}
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
