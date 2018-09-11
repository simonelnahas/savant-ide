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
