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
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AssignmentIcon from '@material-ui/icons/Description';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import SendIcon from '@material-ui/icons/Send';
import styled from 'styled-components';

import CallTab from './Call';
import DeployTab from './Deploy';
import StateTab from './State';

import { Caller, Deployer } from '../types';
import { ContractSrcFile } from '../../store/fs/types';
import { Account } from '../../store/blockchain/types';
import { ABI, Contract } from '../../store/contract/types';

const Wrapper = styled(Paper)`
  display: flex;
  height: 100%;
  flex-direction: column;

  & .tabs {
    min-height: 72px;
  }
`;

const Content = styled.div`
  overflow: auto;
  flex: 1 1 auto;
  display: flex;
  padding: 0 1em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface Props {
  deployContract: Deployer;
  isDeployingContract: boolean;
  callTransition: Caller;
  isCallingTransition: boolean;
  accounts: { [address: string]: Account };
  deployedContracts: { [address: string]: Contract };
  files: { [name: string]: ContractSrcFile };
  abi: ABI | null;
}

interface State {
  value: number;
}

export default class RunnerNav extends React.Component<Props, State> {
  state: State = {
    value: 0,
  };

  handleChange = (_: React.ChangeEvent<any>, value: number) => {
    this.setState({ value });
  };

  renderContent = () => {
    switch (this.state.value) {
      case 0:
        return (
          <CallTab
            accounts={this.props.accounts}
            callTransition={this.props.callTransition}
            deployedContracts={this.props.deployedContracts}
            isCalling={this.props.isCallingTransition}
          />
        );
      case 1:
        return <StateTab accounts={this.props.accounts} contracts={this.props.deployedContracts} />;
      case 2:
        return (
          <DeployTab
            accounts={this.props.accounts}
            files={this.props.files}
            deployContract={this.props.deployContract}
            isDeploying={this.props.isDeployingContract}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <Wrapper classes={{ root: 'root' }} square>
        <Tabs
          classes={{ root: 'tabs' }}
          value={this.state.value}
          onChange={this.handleChange}
          fullWidth
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab icon={<PlayIcon />} label="Call" />
          <Tab icon={<AssignmentIcon />} label="State" />
          <Tab icon={<SendIcon />} label="Deploy" />
        </Tabs>
        <Content>{this.renderContent()}</Content>
      </Wrapper>
    );
  }
}
