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

interface Validator {
  type: string;
  match: (type: string) => boolean;
  validatorFn: (value: string) => boolean;
}

const Matchers: { [type: string]: RegExp } = {
  ByStrX: /^ByStr[0-9]+$/,
  String: /^String$/,
  Uint: /^Uint(32|64|128|256)$/,
  Int: /^Int(32|64|128|256)$/,
  BNum: /^BNum$/,
};

const Validators: { [type: string]: RegExp } = {
  ByStrX: /^0x[A-F0-9]{20,65}$/i,
  String: /\w+/i,
  Uint: /^[0-9]+$/,
  Int: /^(-|\+)?[0-9]+$/,
  BNum: /^[1-9]([0-9])*$/,
};

const validators: Validator[] = [
  {
    type: 'ByStrX',
    match: (type: string) => Matchers.ByStrX.test(type),
    validatorFn: (value) => Validators.ByStrX.test(value),
  },
  {
    type: 'UInt',
    match: (type: string) => Matchers.Uint.test(type),
    validatorFn: (value) => Validators.Uint.test(value),
  },
  {
    type: 'Int',
    match: (type: string) => Matchers.Int.test(type),
    validatorFn: (value) => Validators.Int.test(value),
  },
  {
    type: 'BNum',
    match: (type: string) => Matchers.BNum.test(type),
    validatorFn: (value) => Validators.BNum.test(value),
  },
  {
    type: 'String',
    match: (type: string) => Matchers.String.test(type),
    validatorFn: (value) => Validators.String.test(value),
  },
];

export const validate = (type: string, value: string) => {
  return validators.some((val) => val.match(type) && val.validatorFn(value));
};
