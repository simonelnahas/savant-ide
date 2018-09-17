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

// parser types
export type TypeKind = ADTypeKind | NumTypeKind | BCTypeKind | 'Map';

export const enum ADTypeKind {
  /* ADTs */
  List = 'List',
  Pair = 'Pair',
  Option = 'Option',
  Bool = 'Bool',
  Nat = 'Nat',
}

export const enum NumTypeKind {
  Uint32 = 'Uint32',
  Uint64 = 'Uint64',
  Uint128 = 'Uint128',
  Uint256 = 'Uint256',
  Int32 = 'Int32',
  Int64 = 'Int64',
  Int128 = 'Int128',
  Int256 = 'Int256',
}

export const enum BCTypeKind {
  /* Blockchain */
  Address = 'Address',
  Hash = 'Hash',
  ByStr20 = 'ByStr20',
  ByStr32 = 'ByStr32',
  ByStr33 = 'ByStr33',
  ByStr65 = 'ByStr65',
  BNum = 'BNum',
  Str = 'String',
}

interface BaseTypeNode {
  kind: string;
}

export interface ListTypeNode extends BaseTypeNode {
  kind: ADTypeKind.List;
  arguments: TypeNode;
}

export interface PairTypeNode extends BaseTypeNode {
  kind: ADTypeKind.Pair;
  arguments: [TypeNode, TypeNode];
}

export interface OptionTypeNode extends BaseTypeNode {
  kind: ADTypeKind.Option;
}

export interface NatTypeNode extends BaseTypeNode {
  kind: ADTypeKind.Nat;
}

export interface BoolTypeNode extends BaseTypeNode {
  kind: ADTypeKind.Bool;
}

export type ADTypeNode = ListTypeNode | PairTypeNode | OptionTypeNode | NatTypeNode | BoolTypeNode;

interface BasePrimTypeNode extends BaseTypeNode {
  value: string; // Scilla's numeric output is string. This should be cast to BN to prevent overflow.
}

interface Uint32TypeNode extends BasePrimTypeNode {
  kind: NumTypeKind.Uint32;
}

interface Uint64TypeNode extends BasePrimTypeNode {
  kind: NumTypeKind.Uint64;
}

interface Uint128TypeNode extends BasePrimTypeNode {
  kind: NumTypeKind.Uint128;
}

interface Uint256TypeNode extends BasePrimTypeNode {
  kind: NumTypeKind.Uint256;
}

interface Int32TypeNode extends BasePrimTypeNode {
  kind: NumTypeKind.Int32;
}

interface Int64TypeNode extends BasePrimTypeNode {
  kind: NumTypeKind.Int64;
}

interface Int128TypeNode extends BasePrimTypeNode {
  kind: NumTypeKind.Int128;
}

interface Int256TypeNode extends BasePrimTypeNode {
  kind: NumTypeKind.Int256;
}

export type NumTypeNode =
  | Uint32TypeNode
  | Uint64TypeNode
  | Uint128TypeNode
  | Uint256TypeNode
  | Int32TypeNode
  | Int64TypeNode
  | Int128TypeNode
  | Int256TypeNode;

interface BNumTypeNode extends BasePrimTypeNode {
  kind: BCTypeKind.BNum;
}

interface AddressTypeNode extends BasePrimTypeNode {
  kind: BCTypeKind.Address;
}

interface StringTypeNode extends BasePrimTypeNode {
  kind: BCTypeKind.Address;
}

interface HashTypeNode extends BasePrimTypeNode {
  kind: BCTypeKind.Hash;
}

export type BCTypeNode = BNumTypeNode | AddressTypeNode | StringTypeNode | HashTypeNode;

export type PrimTypeNode = NumTypeNode | BCTypeNode;

export interface MapTypeNode extends BaseTypeNode {
  kind: 'Map';
  arguments: [PrimTypeNode, TypeNode];
}

export type TypeNode = ADTypeNode | PrimTypeNode | MapTypeNode;
