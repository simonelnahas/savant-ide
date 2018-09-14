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
