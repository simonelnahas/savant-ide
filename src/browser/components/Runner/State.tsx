import * as React from 'react';
import JSONTree from 'react-json-tree';

/* import Typography from '@material-ui/core/Typography'; */

interface Props {
  contracts: any;
  accounts: any;
}

export default class StateTree extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <JSONTree theme="monokai" hideRoot invertTheme data={this.props.contracts} />
        <JSONTree theme="monokai" hideRoot invertTheme data={this.props.accounts} />
      </React.Fragment>
    );
  }
}
