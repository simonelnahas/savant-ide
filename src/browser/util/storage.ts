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

import { ContractSrcFile } from '../store/fs/types';

const DEFAULT_CONTRACTS = [
  'HelloWorld',
  'BookStore',
  'CrowdFunding',
  'Auction',
  'FungibleToken',
  'NonFungible',
  'ZilGame',
  'SchnorrTest',
];

export const extractDefault = (contracts: ContractSrcFile[]): ContractSrcFile[] => {
  const defaults: ContractSrcFile[] = [];

  const customs = contracts.filter((contract) => {
    if (DEFAULT_CONTRACTS.indexOf(contract.displayName) === -1) {
      return true;
    }

    defaults.push(contract);
    return false;
  });

  return [
    ...customs,
    ...defaults.sort(
      (fst, snd) =>
        DEFAULT_CONTRACTS.indexOf(fst.displayName) > DEFAULT_CONTRACTS.indexOf(snd.displayName)
          ? 1
          : -1,
    ),
  ];
};
