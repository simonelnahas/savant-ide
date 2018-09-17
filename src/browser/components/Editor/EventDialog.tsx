/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pvt. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
 */

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
