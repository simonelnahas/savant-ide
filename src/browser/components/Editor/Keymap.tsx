import React from 'react';
import styled from 'styled-components';

import { withStyles, WithStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const Chiclet = styled.span`
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  color: #707070;
  font-size: 13px;
  padding: 6px 8px;
  font-family: monospace;
  margin: 0 4px 0 0;
`;

interface Props {
  bindings: Array<{ key: string; command: string }>;
}

const Keymap = (props: Props & WithStyles) => {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Shortcut</TableCell>
            <TableCell>Command</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.bindings.map((binding) => {
            return (
              <TableRow key={binding.command}>
                <TableCell component="th" scope="row">
                  {binding.key.split('-').map((key, idx, keys) => (
                    <React.Fragment key={idx}>
                      <Chiclet>{key}</Chiclet>
                      {idx !== keys.length - 1 ? '+' : null}
                    </React.Fragment>
                  ))}
                </TableCell>
                <TableCell style={{ fontFamily: 'monospace' }}>{binding.command}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withStyles(styles)(Keymap);
