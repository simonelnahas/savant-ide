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

import * as React from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import Slider from '@material-ui/lab/Slider';

import InputWrapper, { Wrapper } from '../Form/InputWrapper';
import { MsgFieldDict } from '../../util/form';

interface Props {
  handleMsgChange: React.ChangeEventHandler<HTMLInputElement>;
  handleGasPriceChange: (e: any, value: any) => void;
  values: MsgFieldDict;
}

export default class TxParams extends React.Component<Props> {
  render() {
    const { handleMsgChange, handleGasPriceChange, values } = this.props;
    return (
      <FormGroup classes={{ root: 'form' }}>
        <InputWrapper error={values._amount.error}>
          <InputLabel htmlFor="_amount">Amount (Uint128)</InputLabel>
          <Input
            onChange={handleMsgChange}
            id="_amount"
            name="_amount"
            value={values._amount.value}
          />
          {values._amount.error && <FormHelperText>Please fill in a valid value</FormHelperText>}
        </InputWrapper>
        <InputWrapper error={values.gaslimit.error}>
          <InputLabel htmlFor="gaslimit">Gas Limit (Uint128)</InputLabel>
          <Input
            onChange={handleMsgChange}
            id="gaslimit"
            name="gaslimit"
            value={values.gaslimit.value}
          />
          {values.gaslimit.error && <FormHelperText>Please fill in a valid value</FormHelperText>}
        </InputWrapper>
        <Wrapper>
          <InputLabel htmlFor="gasprice">Gas Price: {values.gasprice.value}</InputLabel>
          <Slider
            onChange={handleGasPriceChange}
            value={values.gasprice.value}
            min={1}
            max={100}
            step={1}
          />
        </Wrapper>
      </FormGroup>
    );
  }
}
