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

import { ContractSrcFile } from '../../store/fs/types';
import { ABI } from '../../store/contract/types';

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
        return <CallTab abi={this.props.abi} />;
      case 1:
        return null;
      case 2:
        return <DeployTab files={this.props.files} />;
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
        <Content>
          {this.renderContent()}
        </Content>
      </Wrapper>
    );
  }
}
