import * as React from 'react';
import Collapse from '@material-ui/core/Collapse';

interface Props {
  children: () => React.ReactNode;
  expander?: (isOpen: boolean) => React.ReactNode;
}

interface State {
  isOpen: boolean;
}

export default class Collapsible extends React.Component<Props, State> {
  state: State = { isOpen: false };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <React.Fragment>
        <span onClick={this.toggle}>
          {(this.props.expander && this.props.expander(this.state.isOpen)) || '+'}
        </span>
        <Collapse in={this.state.isOpen}>{this.props.children()}</Collapse>
      </React.Fragment>
    );
  }
}
