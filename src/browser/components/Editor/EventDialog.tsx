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
