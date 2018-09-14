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
  blockNum: number;
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
        <Typography
          style={{ margin: '1em 1em' }}
          variant="body2"
          color="textSecondary"
          align="left"
        >{`Block Height: ${this.props.blockNum}`}</Typography>
        <Content>{this.renderContent()}</Content>
      </Wrapper>
    );
  }
}
