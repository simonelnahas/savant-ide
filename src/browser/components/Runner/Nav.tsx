import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import AssignmentIcon from '@material-ui/icons/Description';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import SendIcon from '@material-ui/icons/Send';
import styled from 'styled-components';

import CallTab from './Call';
import DeployTab from './Deploy';

import { ContractSrcFile } from '../../store/fs/types';
import { Account } from '../../store/blockchain/types';
import { ABI, Contract, DeploymentResult } from '../../store/contract/types';

const Wrapper = styled(Paper)`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  padding: 0 1em;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface Props {
  deployContract: (
    code: string,
    init: { [key: string]: any },
    deployer: Account,
    successCb: (result: DeploymentResult) => void,
  ) => void;
  callTransition: (address: string, sender: Account, params: any) => void;
  activeAccount: Account | null;
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
    if (!this.props.activeAccount) {
      return <Typography variant="headline">Please select an account.</Typography>;
    }

    switch (this.state.value) {
      case 0:
        return (
          <CallTab
            activeAccount={this.props.activeAccount}
            callTransition={this.props.callTransition}
            deployedContracts={this.props.deployedContracts}
          />
        );
      case 1:
        return null;
      case 2:
        return (
          <DeployTab
            activeAccount={this.props.activeAccount}
            deployContract={this.props.deployContract}
            files={this.props.files}
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
