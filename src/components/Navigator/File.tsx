import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from './Menu';

interface Props {
  text: string;
  handleSelect: (name: string) => void;
  handlePersist: (name: string) => void;
}

interface State {
  text: string;
  isRenaming: boolean;
  isMenuOpen: boolean;
}

export default class File extends React.Component<Props, State> {
  textNode = React.createRef<HTMLParagraphElement>();
  state: State = { isRenaming: false, isMenuOpen: false, text: '' };

  componentDidMount() {
    const { text } = this.props;

    if (!text || (text.length && text.length === 0)) {
      this.setRenaming();
    }

    this.setState({ text });
  }

  setRenaming = () => {
    this.setState({ isRenaming: true });

    setTimeout(() => {
      if (this.textNode.current) {
        this.textNode.current.contentEditable = 'true';
        this.textNode.current.focus();
      }
    });
  };

  handleChange: React.ChangeEventHandler<HTMLParagraphElement> = (e) => {
    this.setState({ text: e.currentTarget.innerText });
  };

  handleDelete = () => {
    console.log('deleted file');
  };

  handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // left click
    if (e.button === 0) {
      this.props.handleSelect(this.props.text);
      return;
    }

    if (e.button === 2) {
      this.setState({ isMenuOpen: true });
      return;
    }
  };

  handleCloseContextMenu = () => {
    this.setState({ isMenuOpen: false });
  };

  handleKeyDown: React.KeyboardEventHandler<HTMLParagraphElement> = (e) => {
    // intercept all 'enter' || 'escape' events
    if (e.keyCode === 13 || e.keyCode === 27) {
      e.preventDefault();
      e.currentTarget.blur();
      return;
    }
  };

  handleFocus = () => {
    setTimeout(() => {
      if (this.textNode.current && this.textNode.current.childNodes.length) {
        const textNode = this.textNode.current.childNodes[0];
        const sel = window.getSelection();
        const range = document.createRange();
        range.setStart(textNode, textNode.textContent ? textNode.textContent.length : 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  };

  handleBlur = () => {
    /* e.preventDefault(); */
    if (this.state.isRenaming && this.textNode.current) {
      this.textNode.current.contentEditable = 'false';
      this.props.handlePersist(this.state.text);
      this.setState({ isRenaming: false });
    }
  };

  render() {
    const { text } = this.state;

    return (
      <React.Fragment>
        <ClickAwayListener onClickAway={this.handleBlur}>
          <ListItem key="item" button onClick={this.handleClick} onContextMenu={this.handleClick}>
            <ListItemText>
              <p
                tabIndex={this.state.isRenaming ? 0 : undefined}
                ref={this.textNode}
                onFocus={this.handleFocus}
                onKeyDown={this.handleKeyDown}
              >
                {text}
              </p>
            </ListItemText>
          </ListItem>
        </ClickAwayListener>
        <Menu
          key="ctx"
          handleRename={this.setRenaming}
          handleDelete={this.handleDelete}
          handleClose={this.handleCloseContextMenu}
          isOpen={this.state.isMenuOpen}
          anchorEl={this.textNode}
        />
      </React.Fragment>
    );
  }
}
