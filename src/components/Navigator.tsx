import * as React from 'react';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import FolderIcon from '@material-ui/icons/Folder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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

const ZDrawer = styled(Drawer)`
  & .paper {
    position: relative;
    width: 200px;
`;

const Logo = styled.img`
  max-width: 100%;
`;

export default class Navigator extends React.Component<Props> {
  render() {
    return (
      <ZDrawer variant="permanent" classes={{ paper: 'paper' }}>
        <Logo src={logo} />
        <List>
          <ListItem button>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Files" />
          </ListItem>
          <Divider />
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
    );
  }
}
