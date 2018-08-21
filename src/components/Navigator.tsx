import * as React from 'react';

import ArrowLeft from '@material-ui/icons/ArrowLeft';
import FolderIcon from '@material-ui/icons/Folder';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import styled from 'styled-components';

import logo from './scilla-logo-color-transparent.png';

interface FileDescriptor {
  name: string;
  extension: string;
  size: string;
}

interface Props {
  files: FileDescriptor[];
}

interface State {
  isOpen: boolean;
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

export default class Navigator extends React.Component<Props, State> {
  state: State = {
    isOpen: true,
  };

  toggle: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <React.Fragment>
        <ZDrawer
          variant="permanent"
          classes={{ paper: classNames('paper', this.state.isOpen ? 'open' : 'closed') }}
        >
          <Logo src={logo} />
          <List>
            <ListItem>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Files" />
            </ListItem>
            {this.props.files.map((file) => {
              return (
                <ListItem key={file.name} button>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={file.name} />
                </ListItem>
              );
            })}
          </List>
        </ZDrawer>
        <Closer>
          <Arrow
            classes={{ root: classNames('closer-icon', !this.state.isOpen && 'closed') }}
            onClick={this.toggle}
          />
        </Closer>
      </React.Fragment>
    );
  }
}
