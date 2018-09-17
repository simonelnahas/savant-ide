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
import classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import AddIcon from '@material-ui/icons/Add';
import HelpIcon from '@material-ui/icons/HelpOutlineOutlined';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import File from './File';
import { ApplicationState } from '../../store/index';
import { ContractSrcFile } from '../../store/fs/types';
import * as fsActions from '../../store/fs/actions';
import { extractDefault } from '../../util/storage';
import config from '../../config';
import logo from './scilla-logo-color-transparent.png';

const ZDrawer = styled(Drawer)`
  & .paper {
    position: relative;
    width: 250px;
  }

  & .closed {
    margin-right: -250px;
  }

  & .adder {
    margin: 1em;
  }
`;

const Logo = styled.img`
  max-width: 75%;
  margin: 0 auto;
`;

const Arrow = styled(ArrowLeft)`
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
  toggle: () => void;
}

interface MappedProps {
  error: boolean;
  isLoading: boolean;
  contracts: ContractSrcFile[];
  activeContract: string;
}

interface DispatchProps {
  init: typeof fsActions.init;
  addContract: typeof fsActions.add;
  selectContract: typeof fsActions.setSelectedContract;
  updateContract: typeof fsActions.update;
  deleteContract: typeof fsActions.deleteContract;
}

type Props = OwnProps & MappedProps & DispatchProps;

interface State {
  isAdding: boolean;
}

class Navigator extends React.Component<Props, State> {
  state: State = {
    isAdding: false,
  };

  componentDidMount() {
    this.props.init();
  }

  toggle: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    this.props.toggle();
  };

  handleNew = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ isAdding: true });
  };

  handlePersist = (displayName: string, id?: string) => {
    if (this.state.isAdding) {
      // dispatch add contract
      this.props.addContract(displayName, '');
      this.setState({ isAdding: false });
      return;
    }

    const { contracts } = this.props;

    if (id) {
      const [active] = contracts.filter((ctr) => ctr.id === id);
      this.props.updateContract(id, displayName, active.code);
    }
  };

  handleSelect = (id: string) => {
    // don't select an already-active contract
    if (this.props.activeContract !== id) {
      this.props.selectContract(id);
      return;
    }
  };

  handleDelete = (id: string) => {
    this.props.deleteContract(id);
  };

  render() {
    const { isAdding } = this.state;
    const { isOpen } = this.props;

    return (
      <React.Fragment>
        <ZDrawer
          open={isOpen}
          anchor="left"
          variant="persistent"
          classes={{ paper: classNames('paper', isOpen ? 'open' : 'closed') }}
        >
          <Logo src={logo} />
          <Button
            color="primary"
            classes={{ root: 'adder' }}
            aria-label="Documentation"
            size="small"
            target="_blank"
            href={config.SCILLA_DOCS}
          >
            <HelpIcon />
            Scilla Docs
          </Button>
          <Button
            color="primary"
            classes={{ root: 'adder' }}
            aria-label="Add Contract"
            onClick={this.handleNew}
          >
            <AddIcon />
            New Contract
          </Button>
          <List dense subheader={<ListSubheader component="div">Files</ListSubheader>}>
            {isAdding ? (
              <File
                key="pending"
                id=""
                name=""
                handlePersist={this.handlePersist}
                handleSelect={this.handleSelect}
                handleDelete={this.handleDelete}
              />
            ) : null}
            {extractDefault(this.props.contracts).map((file) => {
              return (
                <File
                  key={file.id}
                  id={file.id}
                  name={file.displayName}
                  isSelected={file.id === this.props.activeContract}
                  handlePersist={this.handlePersist}
                  handleSelect={this.handleSelect}
                  handleDelete={this.handleDelete}
                />
              );
            })}
          </List>
        </ZDrawer>
        <Closer>
          <Arrow
            classes={{ root: classNames('closer-icon', !isOpen && 'closed') }}
            onClick={this.toggle}
          />
        </Closer>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  init: () => dispatch(fsActions.init()),
  addContract: (name: string, code: string) => dispatch(fsActions.add(name, code)),
  selectContract: (name: string) => dispatch(fsActions.setSelectedContract(name)),
  updateContract: (id: string, displayName: string, code: string) =>
    dispatch(fsActions.update(id, displayName, code)),
  deleteContract: (id: string) => dispatch(fsActions.deleteContract(id)),
});

const mapStateToProps = (state: ApplicationState) => {
  const contractsArr: ContractSrcFile[] = Object.keys(state.fs.contracts).map((address) => {
    return state.fs.contracts[address];
  });

  return {
    contracts: contractsArr,
    isLoading: state.fs.loading,
    error: state.fs.error,
    activeContract: state.fs.activeContract,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navigator);
