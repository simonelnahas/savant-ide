/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
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
