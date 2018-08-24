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
