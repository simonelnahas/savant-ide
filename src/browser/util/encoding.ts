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

import { parse } from './parser';

import {
  ADTypeKind,
  BCTypeKind,
  NumTypeKind,
  MapTypeNode,
  ListTypeNode,
  PairTypeNode,
  BoolTypeNode,
  NatTypeNode,
  OptionTypeNode,
} from './types';

import { KVPair } from '../store/contract/types';

type PrimValue = string;

type MapValue = Array<{
  key: string; // key can only be primitive type
  val: Value;
}>;

interface ListValue {
  constructor: 'Cons' | 'Nil';
  argtypes: [string];
  arguments: [Value, ListValue]; // (elementValue, Cons|Nil)
}

interface PairValue {
  constructor: 'Pair';
  argtypes: [string, string];
  arguments: [Value, Value];
}

interface BoolValue {
  constructor: 'True' | 'False';
}

interface OptionValue {
  constructor: 'Some' | 'None';
  argtypes: [string];
  arguments: [Value];
}

interface NatValue {
  constructor: 'Zero' | 'Succ';
  arguments: [NatValue] | null;
}

type Value = PrimValue | MapValue | ListValue | PairValue | OptionValue | BoolValue;

// raw output from scilla
interface Output {
  type: string;
  vname?: string;
  value: any;
}

interface NumField extends Output {
  kind: NumTypeKind;
  value: PrimValue;
}

interface ByteField extends Output {
  kind: BCTypeKind;
  value: PrimValue;
}

// with type node added
interface MapField extends Output, MapTypeNode {
  value: MapValue;
}

interface ListField extends Output, ListTypeNode {
  value: ListValue;
}

interface PairField extends Output, PairTypeNode {
  value: PairValue;
}

interface OptionField extends Output, OptionTypeNode {
  value: OptionValue;
}

interface BoolField extends Output, BoolTypeNode {
  value: BoolValue;
}

interface NatField extends Output, NatTypeNode {
  value: NatValue;
}

type Field =
  | MapField
  | NumField
  | ListField
  | PairField
  | OptionField
  | BoolField
  | NatField
  | ByteField;

export const deserialiseContractState = (outputs: KVPair[]) => {
  return outputs.reduce((stateObj, kvpair) => {
    return {
      ...stateObj,
      [kvpair.vname]: deserialise(withTypes(kvpair)),
    };
  }, {});
};

/**
 * withTypes
 *
 * @param {Field} val
 * @returns {undefined}
 */
export const withTypes = (out: Output): Field => {
  const typeNode = parse(out.type);
  return <Field>{ ...typeNode, ...out };
};

export const deserialise = (field: Field): any => {
  switch (field.kind) {
    case 'Map': {
      const [keyType, valType] = field.arguments;
      const res = field.value.reduce((acc, kv) => {
        const { key, val } = kv;
        const k = <Field>{ value: key, ...keyType };
        const v = <Field>{ value: val, ...valType };

        return {
          ...acc,
          [deserialise(k)]: deserialise(v),
        };
      }, {});

      return res;
    }

    case ADTypeKind.List: {
      let tail = field.value;
      const res: any[] = [];

      // avoid recursion in case of stack overflow
      while (tail.constructor === 'Cons') {
        res.push(deserialise(withTypes({ value: tail.arguments[0], type: tail.argtypes[0] })));
        tail = tail.arguments[1];
      }

      return res;
    }

    case ADTypeKind.Pair: {
      const [leftType, rightType] = field.value.argtypes;
      const [leftVal, rightVal] = field.value.arguments;

      return [
        deserialise(withTypes({ type: leftType, value: leftVal })),
        deserialise(withTypes({ type: rightType, value: rightVal })),
      ];
    }

    case ADTypeKind.Nat: {
      if (field.value.constructor === 'Zero') {
        return 0;
      }

      let int = 0;
      let curr: NatValue | null = field.value;
      // recursively determine the integer value of this Peano number, again
      // deliberately avoiding true recursion to avoid blowing up the stack.
      while (curr && curr.constructor === 'Succ') {
        curr = curr.arguments && curr.arguments.length > 0 ? curr.arguments[0] : null;
        int++;
      }

      return int;
    }

    case ADTypeKind.Option: {
      if (field.value.constructor === 'None') {
        return null;
      }

      return deserialise(
        withTypes({ value: field.value.arguments[0], type: field.value.argtypes[0] }),
      );
    }

    case ADTypeKind.Bool: {
      return JSON.parse(field.value.constructor.toLowerCase());
    }

    case NumTypeKind.Int32:
    case NumTypeKind.Int64:
    case NumTypeKind.Int128:
    case NumTypeKind.Int256:
    case NumTypeKind.Uint32:
    case NumTypeKind.Uint64:
    case NumTypeKind.Uint128:
    case NumTypeKind.Uint256:
    case BCTypeKind.BNum: {
      return field.value;
    }

    case BCTypeKind.ByStr20:
    case BCTypeKind.ByStr32:
    case BCTypeKind.ByStr33:
    case BCTypeKind.ByStr65:
    case BCTypeKind.Str:
    case BCTypeKind.Address:
    case BCTypeKind.Hash: {
      return field.value;
    }

    default: {
      return null;
    }
  }
};
