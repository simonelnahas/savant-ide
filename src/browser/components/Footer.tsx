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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faReddit,
  faMedium,
  faSlack,
  faGitter,
  faYoutube,
  faTelegram,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import * as React from 'react';
import styled from 'styled-components';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5em;
`;

const SOCIAL_ICONS = [
  { network: 'twitter', href: 'https://www.twitter.com/zilliqa', icon: faTwitter },
  { network: 'reddit', href: 'https://www.reddit.com/r/zilliqa', icon: faReddit },
  { network: 'medium', href: 'https://blog.zilliqa.com/', icon: faMedium },
  { network: 'slack', href: 'https://invite.zilliqa.com/', icon: faSlack },
  { network: 'gitter', href: 'https://gitter.im/Zilliqa', icon: faGitter },
  { network: 'youtube', href: 'https://www.youtube.com/channel/UCvinnFbf0u71cajoxKcfZIQ', icon: faYoutube },
  { network: 'telegram', href: 'https://t.me/zilliqachat', icon: faTelegram },
  { network: 'github', href: 'https://www.github.com/Zilliqa', icon: faGithub },
];

class Footer extends React.Component<WithTheme> {
  render() {
    return (
      <Wrapper>
        <Typography variant="subheading" align="center" style={{ flex: '1 1 auto' }}>
          Zilliqa © 2019
        </Typography>
        {SOCIAL_ICONS.map(({ href, icon }) => (
          <a key={href} href={href} target="_blank">
            <FontAwesomeIcon
              icon={icon}
              color={this.props.theme.palette.secondary.main}
              fixedWidth
              size="2x"
            />
          </a>
        ))}
      </Wrapper>
    );
  }
}

export default withTheme()(Footer);
