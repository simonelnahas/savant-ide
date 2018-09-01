import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import sanitizer from 'dompurify';
import styled from 'styled-components';

import Menu from './Menu';

interface Props {
  name: string;
  handleSelect: (name: string) => void;
  handlePersist: (name: string) => void;
  handleDelete: (name: string) => void;
}

interface State {
  name: string;
  isRenaming: boolean;
  isMenuOpen: boolean;
}

const WrappedListText = styled(ListItemText)`
  & .file {
    display: flex;
  }
`;

const MAX_FILENAME_LENGTH = 20;

export default class File extends React.Component<Props, State> {
  textNode = React.createRef<HTMLParagraphElement>();
  state: State = { isRenaming: false, isMenuOpen: false, name: '' };
  sanitizer = sanitizer;

  componentDidMount() {
    const { name } = this.props;

    if (!name || (name.length && name.length === 0)) {
      this.setRenaming();
    }

    this.setState({ name });
  }

  shouldComponentUpdate(_: Props, nextState: State) {
    if (!this.textNode.current) {
      return false;
    }

    return (
      nextState.name !== this.textNode.current.innerText ||
      this.state.isRenaming !== nextState.isRenaming ||
      this.state.isMenuOpen !== nextState.isMenuOpen
    );
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

  handleChange = (e: React.SyntheticEvent<HTMLParagraphElement>, text: string) => {
    if (text.length <= MAX_FILENAME_LENGTH) {
      this.setState({ name: this.sanitizer.sanitize(text) });
      return;
    } else {
      e.preventDefault();
    }
  };

  handleDelete = () => {
    this.props.handleDelete(this.props.name);
  };

  handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // left click
    if (e.button === 0) {
      this.props.handleSelect(this.props.name);
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

  handleInput: React.ChangeEventHandler<HTMLParagraphElement> = (e) => {
    if (!this.textNode.current) {
      return;
    }

    const text = this.textNode.current.innerText;
    this.handleChange(e, text);
  };

  handleKeyDown: React.KeyboardEventHandler<HTMLParagraphElement> = (e) => {
    if (!this.textNode.current) {
      return;
    }

    // intercept all 'enter' || 'escape' events
    if ((e.keyCode === 13 || e.keyCode === 27) && this.textNode.current) {
      e.preventDefault();
      this.textNode.current.blur();
      this.textNode.current.contentEditable = 'false';
      this.props.handlePersist(this.state.name);
      this.setState({ isRenaming: false });
      return;
    }

    this.handleChange(e, this.textNode.current.innerText);
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
    if (this.state.isRenaming && this.textNode.current) {
      this.textNode.current.contentEditable = 'false';
      this.props.handlePersist(this.state.name);
      this.setState({ isRenaming: false });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ClickAwayListener onClickAway={this.handleBlur}>
          <ListItem
            key="item"
            divider
            onClick={this.handleClick}
            onContextMenu={this.handleClick}
            style={{ cursor: 'pointer' }}
          >
            <WrappedListText classes={{ primary: 'file' }}>
              <p
                tabIndex={this.state.isRenaming ? 0 : undefined}
                ref={this.textNode}
                onFocus={this.handleFocus}
                onInput={this.handleInput}
                onKeyDown={this.handleKeyDown}
                dangerouslySetInnerHTML={{ __html: this.state.name }}
              />
              <p>.scilla</p>
            </WrappedListText>
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
