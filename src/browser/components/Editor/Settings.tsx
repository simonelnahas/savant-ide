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
import styled from 'styled-components';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';

import { Keymap } from './index';
import Select from '../Form/Select';

const Transition: React.SFC<SlideProps> = (props) => {
  return <Slide direction="up" {...props} />;
};

const TitleBar = styled.div`
  display: flex;
  padding: 0 24px;
  flex-direction: row;
  flex: 1 0 auto;
  width: 100%;
`;

const LiText = styled(ListItemText)`
  && {
    width: 20%;
    flex: 0 0 auto;
  }
`;

const Control = styled.div`
  width: 30%;
  margin: 0 12px;

  .root {
    width: 100%;
    margin: 0;
  }
`;

interface Props {
  blockNum: number;
  blockTime: number;
  keyMap: Keymap;
  toggle: () => void;
  isOpen: boolean;
  fontSize: number;
  handleSetFontSize: (size: number) => void;
  handleSetKeymap: (keymap: Keymap) => void;
  handleUpdateBlockNum: (num: number) => void;
  handleUpdateBlockTime: (interval: number) => void;
}

interface State {
  blockNum: {
    value: number | null;
    error: string | null;
  };
}

export default class FullScreenDialog extends React.Component<Props, State> {
  state: State = {
    blockNum: {
      value: null,
      error: null,
    },
  };

  onClose = () => {
    this.props.toggle();
  };

  onChangeKeymap: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    this.props.handleSetKeymap(e.target.value as Keymap);
  };

  onChangeFontSize = (_: React.ChangeEvent<{}>, value: number) => {
    this.props.handleSetFontSize(value);
  };

  onUpdateBlockTime = (_: React.ChangeEvent<{}>, value: number) => {
    this.props.handleUpdateBlockTime(value);
  };

  onChangeBlockNum: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    try {
      const num = parseInt(e.target.value, 10);

      if (!num) {
        this.setState({
          blockNum: {
            ...this.state.blockNum,
            error: 'Please enter a number',
          },
        });
      }

      if (num <= 0 || num > 60000) {
        this.setState({
          blockNum: {
            ...this.state.blockNum,
            error: 'Please enter a valid block number',
          },
        });
        return;
      }

      this.setState({
        blockNum: {
          ...this.state.blockNum,
          value: num,
          error: null,
        },
      });

      this.props.handleUpdateBlockNum(num);
    } catch (err) {
      this.setState({
        blockNum: {
          ...this.state.blockNum,
          error: 'Please enter a valid block number',
        },
      });
    }
  };

  render() {
    const { isOpen } = this.props;

    return (
      <Dialog fullScreen open={isOpen} onClose={this.onClose} TransitionComponent={Transition}>
        <DialogContent>
          <TitleBar>
            <Typography variant="display2" style={{ flex: '1 0 auto' }}>
              Settings
            </Typography>
            <IconButton color="primary" onClick={this.onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </TitleBar>
          <List>
            <ListItem>
              <LiText primary="Block Height" secondary="Set current block height" />
              <Control>
                <FormControl
                  error={!!this.state.blockNum.error}
                  style={{ width: '100%', padding: '0 8px' }}
                >
                  <InputLabel style={{ left: '8px' }} htmlFor="_bnum">
                    New Block Height
                  </InputLabel>
                  <Input
                    id="_bnum"
                    name="_bnum"
                    onChange={this.onChangeBlockNum}
                    placeholder="Enter a new block height"
                    value={this.state.blockNum.value || undefined}
                    type="number"
                  />
                  {this.state.blockNum.error && (
                    <FormHelperText>{this.state.blockNum.error}</FormHelperText>
                  )}
                  <FormHelperText>{`Current Block Height: ${this.props.blockNum}`}</FormHelperText>
                </FormControl>
              </Control>
            </ListItem>
            <Divider />
            <ListItem>
              <LiText primary="Block Time" secondary="Control block time (ms)" />
              <Control>
                <Slider
                  onChange={this.onUpdateBlockTime}
                  value={this.props.blockTime}
                  min={1000}
                  max={50000}
                  step={1000}
                />
              </Control>
              <Typography align="left">{`${this.props.blockTime} ms`}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <LiText primary="Editor Font Size" secondary="Set editor size (px)" />
              <Control>
                <Slider
                  onChange={this.onChangeFontSize}
                  value={this.props.fontSize}
                  min={12}
                  max={24}
                  step={1}
                />
              </Control>
              <Typography align="left">{`${this.props.fontSize} px`}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <LiText primary="Editor Keymap" secondary="Set a keymap" />
              <Control>
                <Select
                  onChange={this.onChangeKeymap}
                  placeholder="Editor Keymap"
                  items={[
                    { value: 'standard', key: 'Standard' },
                    { value: 'vim', key: 'Vim' },
                    { value: 'emacs', key: 'Emacs' },
                  ]}
                  value={this.props.keyMap}
                />
              </Control>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    );
  }
}
