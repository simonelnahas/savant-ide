import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import { Account } from '../../store/blockchain/types';
import { ABI, DeploymentResult } from '../../store/contract/types';
import { ContractSrcFile } from '../../store/fs/types';
import { Deployer } from '../types';

import * as api from '../../util/api';
import { toMsgFields, toScillaParams, FieldDict, MsgFieldDict } from '../../util/form';
import Select from '../Form/Select';
import InitForm from './InitForm';

const Wrapper = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }
`;

interface Props {
  deployContract: Deployer;
  activeAccount: Account;
  files: { [name: string]: ContractSrcFile };
}

interface State {
  error: string;
  isChecking: boolean;
  selected: string;
  abi: ABI | null;
  result: DeploymentResult | null;
}

export default class DeployTab extends React.Component<Props, State> {
  state: State = {
    selected: '',
    error: '',
    isChecking: false,
    abi: null,
    result: null,
  };

  onSelectContract: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    this.setState({ selected: e.target.value });
  };

  onDeploy = (init: FieldDict, msg: MsgFieldDict) => {
    const { deployContract, files, activeAccount } = this.props;
    const sourceFile = files[this.state.selected];
    const initParams = toScillaParams(init);
    const msgParams = toMsgFields(msg);

    console.log('deploying with params: \n');
    console.log(initParams, msgParams);
    deployContract(sourceFile.code, initParams, msgParams, activeAccount, this.onDeployResult);
  };

  onDeployResult = (result: DeploymentResult) => this.setState({ result });

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
              abiParams={abi.params}
              result={result}
            />
          )
        )}
      </Wrapper>
    );
  }
}
