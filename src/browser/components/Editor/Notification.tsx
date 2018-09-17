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

import React from 'react';
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

interface Props {
  msg: string;
  variant: 'success' | 'error';
}

const Content = styled(SnackbarContent)`
  &.success {
    background: ${green[600]};
  }

  &.error {
    background: ${red[600]};
  }
`;

const Notification: React.SFC<Props & SnackbarProps> = (props) => {
  return (
    <Snackbar
      autoHideDuration={3500}
      open={props.open}
      onExited={props.onExited}
      onClose={props.onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Content
        className={props.variant}
        message={<span>{props.msg}</span>}
        // @ts-ignore
        action={[
          // @ts-ignore
          <IconButton key="close" aria-label="Close" color="inherit" onClick={props.onClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default Notification;
