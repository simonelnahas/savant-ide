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
import { Contract, RunnerResult, KVPair } from '../../store/contract/types';
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
  isDeployingContract: boolean;
  isCallingTransition: boolean;
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
            isCallingTransition={this.props.isCallingTransition}
            deployContract={this.props.deployContract}
            isDeployingContract={this.props.isDeployingContract}
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
    gaslimit: number,
    gasprice: number,
    resultCb: (result: RunnerResult) => void,
  ) => dispatch(contractActions.deploy(code, init, msg, deployer, gaslimit, gasprice, resultCb)),
  callTransition: (
    address: string,
    transition: string,
    tParams: KVPair[],
    msg: { [key: string]: string },
    caller: Account,
    gaslimit: number,
    gasprice: number,
    resultCb: (result: RunnerResult) => void,
  ) =>
    dispatch(
      contractActions.call(address, transition, tParams, msg, caller, gaslimit, gasprice, resultCb),
    ),
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
    isDeployingContract: state.contract.isDeployingContract,
    isCallingTransition: state.contract.isCallingTransition,
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
