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
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import Loader from '../Loader';
import { Account } from '../../store/blockchain/types';
import { ABI, RunnerResult } from '../../store/contract/types';
import { ContractSrcFile } from '../../store/fs/types';
import { Deployer } from '../types';

import Status from '../Status';
import * as api from '../../util/api';
import { toMsgFields, toScillaParams, FieldDict, MsgFieldDict } from '../../util/form';
import Select from '../Form/Select';
import InitForm from './InitForm';

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
  deployContract: Deployer;
  isDeploying: boolean;
  accounts: { [address: string]: Account };
  files: { [id: string]: ContractSrcFile };
}

interface State {
  error: any;
  isChecking: boolean;
  selected: string;
  abi: ABI | null;
  result: RunnerResult | null;
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
    this.setState({ selected: e.target.value, abi: null, result: null });
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
    const { gaslimit, gasprice, ...msgParams } = toMsgFields(msg);

    deployContract(
      sourceFile.code,
      initParams,
      msgParams,
      activeAccount,
      gaslimit,
      gasprice,
      this.onDeployResult,
    );
  };

  onDeployResult = (result: RunnerResult) => this.setState({ result });

  reset = () =>
    this.setState({
      activeAccount: null,
      selected: '',
      error: '',
      isChecking: false,
      abi: null,
      result: null,
    });

  getAccountOptions = () => {
    const { accounts } = this.props;

    return Object.keys(accounts).map((address) => ({
      key: `0x${address.toUpperCase()} (Balance: ${accounts[address].balance} ZIL, Nonce: ${
        accounts[address].nonce
      })`,
      value: address,
    }));
  };

  getContractOptions = () => {
    const { files } = this.props;

    return Object.keys(files).map((id) => ({
      key: `${files[id].displayName}.scilla`,
      value: id,
    }));
  };

  componentDidUpdate(_: Props, prevState: State) {
    if (this.state.selected.length && prevState.selected !== this.state.selected) {
      const { code } = this.props.files[this.state.selected];
      const ctrl = new AbortController();
      this.setState({ isChecking: true, error: null });
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
    const { activeAccount, abi, error, selected, result } = this.state;

    if (error && error.length) {
      return (
        <Status>
          <Typography color="error" variant="body2" style={{ whiteSpace: 'pre-line' }}>
            {` The following errors were encountered during type-checking:

              ${api.formatError(error)}

              Please correct these errors and try again.
            `}
          </Typography>
          <Button
            variant="extendedFab"
            color="primary"
            aria-label="reset"
            onClick={this.reset}
            style={{ margin: '3.5em 0' }}
          >
            Try Again
          </Button>
        </Status>
      );
    }

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
          placeholder="Choose a scilla source file"
          items={this.getContractOptions()}
          value={selected}
          onChange={this.onSelectContract}
        />
        {activeAccount && abi ? (
          <InitForm
            key={abi.name}
            handleReset={this.reset}
            handleSubmit={this.onDeploy}
            isDeploying={this.props.isDeploying}
            abiParams={abi.params}
            result={result}
          />
        ) : (
          this.state.isChecking && <Loader delay={1001} message="Getting ABI..." />
        )}
      </Wrapper>
    );
  }
}
