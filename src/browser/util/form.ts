/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
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
