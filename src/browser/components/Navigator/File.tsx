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

import classNames from 'classnames';
import * as React from 'react';
import sanitizer from 'dompurify';
import styled from 'styled-components';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItem from '@material-ui/core/ListItem';
import ListItemText, { ListItemTextProps } from '@material-ui/core/ListItemText';
import { withTheme, WithTheme } from '@material-ui/core/styles';

import Menu from './Menu';

interface Props extends WithTheme {
  id: string;
  isSelected?: boolean;
  name: string;
  handleSelect: (id: string) => void;
  handlePersist: (id: string, displayName?: string) => void;
  handleDelete: (id: string) => void;
}

interface State {
  name: string;
  isRenaming: boolean;
  isMenuOpen: boolean;
}

const WrappedListText = styled<ListItemTextProps>(ListItemText)`
  & .file {
    display: flex;
  }
`;

const MAX_FILENAME_LENGTH = 20;

class File extends React.Component<Props, State> {
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (!this.textNode.current) {
      return false;
    }

    return (
      nextState.name !== this.textNode.current.innerText ||
      this.state.isRenaming !== nextState.isRenaming ||
      this.state.isMenuOpen !== nextState.isMenuOpen ||
      this.props.isSelected !== nextProps.isSelected
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
    this.props.handleDelete(this.props.id);
  };

  handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // left click
    if (e.button === 0) {
      this.props.handleSelect(this.props.id);
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
    if (e.keyCode === 13 || e.keyCode === 27) {
      e.preventDefault();
      this.textNode.current.blur();
      this.textNode.current.contentEditable = 'false';
      this.props.handlePersist(this.state.name, this.props.id);
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
            <WrappedListText
              classes={{ primary: classNames({ file: true, selected: this.props.isSelected }) }}
            >
              <p
                tabIndex={this.state.isRenaming ? 0 : undefined}
                ref={this.textNode}
                onFocus={this.handleFocus}
                onInput={this.handleInput}
                onKeyDown={this.handleKeyDown}
                dangerouslySetInnerHTML={{ __html: this.state.name }}
                style={{
                  color: this.props.isSelected
                    ? this.props.theme.palette.primary.main
                    : this.props.theme.palette.text.primary,
                }}
              />
              <p
                style={{
                  color: this.props.isSelected
                    ? this.props.theme.palette.primary.main
                    : this.props.theme.palette.text.primary,
                }}
              >
                .scilla
              </p>
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

export default withTheme()(File);
