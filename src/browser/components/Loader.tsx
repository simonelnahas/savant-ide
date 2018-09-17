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
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  delay: number;
  message: string;
}

export default class Loader extends React.Component<Props> {
  render() {
    return (
      <Wrapper>
        <Fade
          in
          style={{
            transitionDelay: `${this.props.delay}ms`,
          }}
          unmountOnExit
        >
          <React.Fragment>
            <CircularProgress style={{ margin: '1em 0' }} />
            <Typography variant="body2">{this.props.message}</Typography>
          </React.Fragment>
        </Fade>
      </Wrapper>
    );
  }
}
