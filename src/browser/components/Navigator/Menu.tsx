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

import * as React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

interface Props {
  handleRename: () => void;
  handleDelete: () => void;
  handleClose: () => void;
  anchorEl: React.RefObject<HTMLParagraphElement>;
  isOpen: boolean;
}

export default class FileMenu extends React.Component<Props> {
  handleDelete: React.MouseEventHandler<HTMLLIElement> = (e) => {
    e.preventDefault();
    const { handleDelete, handleClose } = this.props;
    handleDelete();
    handleClose();
    return;
  };

  handleRename: React.MouseEventHandler<HTMLLIElement> = (e) => {
    e.preventDefault();
    const { handleRename, handleClose } = this.props;
    handleRename();
    handleClose();
    return;
  };

  render() {
    const { isOpen, anchorEl, handleClose } = this.props;

    return (
      <Menu open={isOpen} onClose={handleClose} anchorEl={anchorEl.current}>
        <MenuItem name="rename" onClick={this.handleRename}>
          Rename
        </MenuItem>
        <MenuItem name="delete" onClick={this.handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    );
  }
}
