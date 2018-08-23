import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

interface Props {
  text: string;
  handleSelect: (name: string) => void;
  handlePersist: (name: string) => void;
}

interface State {
  isRenaming: boolean;
}

export default class File extends React.Component<Props, State> {
  textNode = React.createRef<HTMLParagraphElement>();
  state: State = { isRenaming: false };

  componentDidMount() {
    const { text } = this.props;

    if (!text || (text.length && text.length === 0)) {
      this.setRenaming();
    }
  }

  setRenaming = () => {
    this.setState({ isRenaming: true }, () => {
      if (this.textNode.current) {
        this.textNode.current.focus();
      }
    });
  };

  handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // left click
    if (e.button === 0) {
      this.props.handleSelect(this.props.text);
      return;
    }

    if (e.button && e.button === 2) {
      // TODO: this should open up a menu
      console.log('right click');
      return;
    }
  };

  handleKeyDown: React.KeyboardEventHandler<HTMLParagraphElement> = (e) => {
    // intercept all 'enter' || 'escape' events
    if (e.keyCode === 13 || e.keyCode === 27) {
      e.preventDefault();
      e.currentTarget.blur();
      return;
    }
  };

  handleBlur: React.FocusEventHandler<HTMLParagraphElement> = (e) => {
    e.preventDefault();
    console.log('lost focus');
    this.props.handlePersist(e.target.innerText);
  };

  render() {
    const { text } = this.props;
    return (
      <ListItem button onClick={this.handleClick}>
        <ListItemText>
          <p
            tabIndex={this.state.isRenaming ? 0 : undefined}
            ref={this.textNode}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleBlur}
            contentEditable={this.state.isRenaming}
          >
            {text}
          </p>
        </ListItemText>
      </ListItem>
    );
  }
}
