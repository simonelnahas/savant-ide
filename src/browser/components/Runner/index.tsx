import * as React from 'react';

import ArrowRight from '@material-ui/icons/ArrowRight';
import Drawer from '@material-ui/core/Drawer';
import classNames from 'classnames';
/* import { Dispatch } from 'redux'; */
import { connect } from 'react-redux';
import styled from 'styled-components';

import RunnerNav from './Nav';

import { ApplicationState } from '../../store/index';
import { ABI, Contract as ContractState } from '../../store/contract/types';

interface OwnProps {}

interface MappedProps extends ContractState {}

interface DispatchProps {}

type Props = OwnProps & MappedProps & DispatchProps;

interface State {
  isOpen: boolean;
}

const ZDrawer = styled(Drawer)`
  & .paper {
    position: relative;
    transition: width 50ms ease-in;

    &.open {
      width: 100%;
    }

    &.closed {
      width: 0;
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
    cursor: pointer;
  }
`;

class Runner extends React.Component<Props, State> {
  state: State = {
    isOpen: false,
  };

  toggle: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <Closer>
          <Arrow
            classes={{ root: classNames('closer-icon', !isOpen && 'closed') }}
            onClick={this.toggle}
          />
        </Closer>
        <ZDrawer
          anchor="right"
          variant="permanent"
          classes={{ paper: classNames('paper', isOpen ? 'open' : 'closed') }}
        >
          <RunnerNav abi={this.props.abi as ABI} />
        </ZDrawer>
      </React.Fragment>
    );
  }
}

/* const mapDispatchToProps = (dispatch: Dispatch) => ({ */
/*   init: () => dispatch(fsActions.init()), */
/*   addContract: (name: string, code: string) => dispatch(fsActions.add(name, code)), */
/*   selectContract: (name: string) => dispatch(fsActions.setSelectedContract(name)), */
/*   deleteContract: (address: string) => dispatch(fsActions.deleteContract(address)), */
/* }); */

const mapStateToProps = (state: ApplicationState) => {
  return {
    ...state.contract,
  };
};

export default connect(
  mapStateToProps,
  /* mapDispatchToProps, */
)(Runner);
