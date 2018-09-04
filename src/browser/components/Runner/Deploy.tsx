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
  accounts: { [address: string]: Account };
  files: { [name: string]: ContractSrcFile };
}

interface State {
  error: string;
  isChecking: boolean;
  selected: string;
  abi: ABI | null;
  result: DeploymentResult | null;
  activeAccount: Account | null;
}

export default class DeployTab extends React.Component<Props, State> {
  state: State = {
    activeAccount: null,
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

  onSelectAccount: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault();
    this.setState({ activeAccount: this.props.accounts[e.target.value] });
  };

  onDeploy = (init: FieldDict, msg: MsgFieldDict) => {
    const { deployContract, files } = this.props;
    const { activeAccount } = this.state;

    // this case should never arise, but we have to satisfy the typechecker.
    if (!activeAccount) {
      return;
    }

    const sourceFile = files[this.state.selected];
    const initParams = toScillaParams(init);
    const msgParams = toMsgFields(msg);

    console.log('deploying with params: \n');
    console.log(initParams, msgParams);
    deployContract(sourceFile.code, initParams, msgParams, activeAccount, this.onDeployResult);
  };

  onDeployResult = (result: DeploymentResult) => this.setState({ result });

  getAccountOptions = () => {
    const { accounts } = this.props;

    return Object.keys(accounts).map((address) => ({
      key: `0x${address.toUpperCase()} (${accounts[address].balance}) ZIL Nonce: ${
        accounts[address].nonce
      }`,
      value: address,
    }));
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
          this.setState({ error: err.response ? err.response.message : err });
        });
    }
  }

  render() {
    const { files } = this.props;
    const { activeAccount, abi, error, selected, result } = this.state;
    const options = Object.keys(files).map((name) => ({
      key: name,
      value: name,
    }));

    return (
      <Wrapper>
        <Select
          value={(activeAccount && activeAccount.address) || ''}
          placeholder="Select Account"
          onChange={this.onSelectAccount}
          items={this.getAccountOptions()}
        />
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
          activeAccount &&
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
