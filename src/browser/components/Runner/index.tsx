import * as React from 'react';

import ArrowRight from '@material-ui/icons/ArrowRight';
import Drawer from '@material-ui/core/Drawer';
import classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import RunnerNav from './Nav';

import * as bcActions from '../../store/blockchain/actions';
import * as contractActions from '../../store/contract/actions';
import { ApplicationState } from '../../store/index';
import { Account } from '../../store/blockchain/types';
import { Contract, DeploymentResult, KVPair } from '../../store/contract/types';
import { ContractSrcFile } from '../../store/fs/types';

type Props = OwnProps & MappedProps & DispatchProps;

const ZDrawer = styled(Drawer)`
  &.open {
    width: 40%;
    min-width: 40%;
  }

  &.closed {
    width: 0;
  }

  & .paper {
    position: relative;
    transition: width 50ms ease-in;

    &.open {
      width: 100%;
    }
  }

  & .adder {
    margin: 1em;
  }
`;

const Arrow = styled(ArrowRight)`
  && {
    width: 100%;
    font-size: 14px;
    transition: transform 20ms ease-out;
    &.closed {
      transform: rotate(180deg);
    }
  }
`;

const Closer = styled.div`
  background: #efefef;
  display: flex;
  align-items: center;
  position: relative;
  width: 20px;

  & .closer-icon {
    width: 20px;
    font-size: 20px;
    cursor: pointer;
  }
`;

interface OwnProps {
  isOpen: boolean;
  toggle(): void;
}

interface MappedProps {
  active: Contract | null;
  files: { [name: string]: ContractSrcFile };
  accounts: { [address: string]: Account };
  deployedContracts: { [address: string]: Contract };
}

interface DispatchProps {
  initContracts: typeof contractActions.init;
  initBlockchain: typeof bcActions.init;
  deployContract: typeof contractActions.deploy;
  callTransition: typeof contractActions.call;
}

class Runner extends React.Component<Props> {
  toggle: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    this.props.toggle();
  };

  componentDidMount() {
    this.props.initBlockchain();
    this.props.initContracts();
  }

  render() {
    const { isOpen, files } = this.props;
    return (
      <React.Fragment>
        <Closer>
          <Arrow
            classes={{ root: classNames('closer-icon', !isOpen && 'closed') }}
            onClick={this.toggle}
          />
        </Closer>
        <ZDrawer
          open={isOpen}
          variant="persistent"
          anchor="right"
          classes={{
            docked: classNames('root', isOpen ? 'open' : 'closed'),
            paper: classNames('paper', isOpen ? 'open' : 'closed'),
          }}
        >
          <RunnerNav
            callTransition={this.props.callTransition}
            deployContract={this.props.deployContract}
            accounts={this.props.accounts}
            abi={(this.props.active && this.props.active.abi) || null}
            deployedContracts={this.props.deployedContracts}
            files={files}
          />
        </ZDrawer>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initBlockchain: () => dispatch(bcActions.init()),
  initContracts: (name: string, code: string) => dispatch(contractActions.init()),
  deployContract: (
    code: string,
    init: KVPair[],
    msg: { [key: string]: string },
    deployer: Account,
    resultCb: (result: DeploymentResult) => void,
  ) => dispatch(contractActions.deploy(code, init, msg, deployer, resultCb)),
  callTransition: (
    address: string,
    transition: string,
    tParams: KVPair[],
    msg: { [key: string]: string },
    caller: Account,
    gaslimit: string,
    resultCb: (result: DeploymentResult) => void,
  ) =>
    dispatch(contractActions.call(address, transition, tParams, msg, caller, gaslimit, resultCb)),
});

const mapStateToProps = (state: ApplicationState) => {
  const pointer = state.contract.active;
  const files = state.fs.contracts;
  const accounts = state.blockchain.accounts;
  const deployedContracts = state.contract.contracts;
  const baseMappedProps = {
    accounts,
    files,
    deployedContracts,
  };

  if (pointer.address) {
    return { ...baseMappedProps, active: state.contract.contracts[pointer.address] };
  }

  return { ...baseMappedProps, active: null };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Runner);
