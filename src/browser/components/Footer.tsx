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
  { network: 'youtube', href: 'https://www.youtube.com/zilliqa', icon: faYoutube },
  { network: 'telegram', href: 'https://t.me/zilliqachat', icon: faTelegram },
  { network: 'github', href: 'https://www.github.com/Zilliqa', icon: faGithub },
];

class Footer extends React.Component<WithTheme> {
  render() {
    return (
      <Wrapper>
        <Typography variant="subheading">
          <a href="https://ide.zilliqa.com" target="_blank">
            Old IDE
          </a>
        </Typography>
        <Typography variant="subheading" align="center" style={{ flex: '1 1 auto' }}>
          Zilliqa © 2018
        </Typography>
        {SOCIAL_ICONS.map(({ network, href, icon }) => (
          <a href={href} target="_blank">
            <FontAwesomeIcon
              key={network}
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
