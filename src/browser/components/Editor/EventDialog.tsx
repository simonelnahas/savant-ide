import * as React from 'react';
import JSONTree from 'react-json-tree';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Event } from '../../store/contract/types';

const Wrapper = styled.div`
  & * ul {
    background: #ffffff;
    font-family: roboto;
    width: 100%;
  }
`;

interface Props {
  open: boolean;
  event: Event;
  onClose: React.MouseEventHandler<HTMLElement>;
}

export default class EventDialog extends React.Component<Props> {
  render() {
    return this.props.event ? (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">{`${this.props.event.name} (${'0x' +
          this.props.event.address.toUpperCase()})`}</DialogTitle>
        <DialogContent>
          <Wrapper>
            <JSONTree hideRoot data={this.props.event.event || {}} />
          </Wrapper>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    ) : null;
  }
}
