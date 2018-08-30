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
import { Contract } from '../../store/contract/types';
import { ContractSrcFile } from '../../store/fs/types';

type Props = OwnProps & MappedProps & DispatchProps;

const ZDrawer = styled(Drawer)`
  position: relative;
  transition: width 50ms ease-in;

  &.open {
    max-width: 40%;
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
}

interface DispatchProps {
  initContracts: typeof contractActions.init;
  initBlockchain: typeof bcActions.init;
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
          anchor="right"
          variant="permanent"
          classes={{
            docked: classNames('root', isOpen ? 'open' : 'closed'),
            paper: classNames('paper', isOpen ? 'open' : 'closed'),
          }}
        >
          <RunnerNav abi={(this.props.active && this.props.active.abi) || null} files={files} />
        </ZDrawer>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initBlockchain: () => dispatch(bcActions.init()),
  initContracts: (name: string, code: string) => dispatch(contractActions.init()),
});

const mapStateToProps = (state: ApplicationState) => {
  const pointer = state.contract.active;
  const files = state.fs.contracts;

  if (pointer.address) {
    return { active: state.contract.contracts[pointer.address], files };
  }

  return { active: null, files };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Runner);
