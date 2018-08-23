import * as React from 'react';

import AddIcon from '@material-ui/icons/Add';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Button from '@material-ui/core/Button';
import FolderIcon from '@material-ui/icons/Folder';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import File from './File';
import { ApplicationState } from '../../store/index';
import { ContractSrcFile } from '../../store/fs/types';
import * as fsActions from '../../store/fs/actions';
import logo from './scilla-logo-color-transparent.png';

interface OwnProps {}

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
}

type Props = OwnProps & MappedProps & DispatchProps;

interface State {
  isOpen: boolean;
  isAdding: boolean;
}

const ZDrawer = styled(Drawer)`
  & .paper {
    position: relative;
    transition: width 50ms ease-in;

    &.open {
      width: 200px;
    }

    &.closed {
      width: 0;
    }
  }

  & .adder {
    margin: 1em;
  }
`;

const Logo = styled.img`
  max-width: 100%;
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
    cursor: pointer;
  }
`;

class Navigator extends React.Component<Props, State> {
  state: State = {
    isOpen: true,
    isAdding: false,
  };

  componentDidMount() {
    this.props.init();
  }

  toggle: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleNew = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ isAdding: true });
  };

  handlePersist = (name: string) => {
    if (this.state.isAdding) {
      // dispatch add contract
      console.log('new contract being added');
      this.props.addContract(name, '');
      this.setState({ isAdding: false });
      return;
    }
  };

  handleSelect = (name: string) => {
    // don't select an already-active contract
    if (this.props.activeContract !== name) {
      this.props.selectContract(name);
      return;
    }
  };

  render() {
    const { isAdding, isOpen } = this.state;
    return (
      <React.Fragment>
        <ZDrawer
          variant="permanent"
          classes={{ paper: classNames('paper', isOpen ? 'open' : 'closed') }}
        >
          <Logo src={logo} />
          <Button
            classes={{ root: 'adder' }}
            variant="extendedFab"
            aria-label="Add Contract"
            onClick={this.handleNew}
          >
            <AddIcon />
            New Contract
          </Button>
          <List>
            <ListItem>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Files" />
            </ListItem>
            {isAdding ? (
              <File
                key="pending"
                text=""
                handlePersist={this.handlePersist}
                handleSelect={this.handleSelect}
              />
            ) : null}
            {this.props.contracts.map((file) => {
              return (
                <File
                  key={file.hash}
                  text={file.name}
                  handlePersist={this.handlePersist}
                  handleSelect={this.handleSelect}
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
});

const mapStateToProps = (state: ApplicationState) => {
  const contractsArr: ContractSrcFile[] = Object.keys(state.fs.contracts).map((name) => {
    return state.fs.contracts[name];
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
