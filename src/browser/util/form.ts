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

import { KVPair } from '../store/contract/types';

export interface Field {
  value: any;
  type: string;
  touched: boolean;
  error: boolean;
}

export interface MsgField {
  value: any;
  touched: boolean;
  error: boolean;
}

export interface FieldDict {
  [key: string]: Field;
}

export interface MsgFieldDict {
  [key: string]: MsgField;
}

export const isField = (field: Field | MsgField): field is Field => {
  return !!(<Field>field).type;
};

export const toScillaParams = (fields: FieldDict): KVPair[] => {
  return Object.keys(fields).map((name) => {
    return { vname: name, value: fields[name].value, type: fields[name].type };
  });
};

export const toMsgFields = (fields: MsgFieldDict) => {
  return Object.keys(fields).reduce(
    (acc, fName) => ({
      ...acc,
      [fName]: fields[fName].value,
    }),
    {} as { [key: string]: any },
  );
};
