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

import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as blockchainActions from './actions';
import { BlockchainState } from './types';

type BlockchainAction = ActionType<typeof blockchainActions>;

const initialState: BlockchainState = {
  error: null,
  loading: false,
  blockNum: 1,
  accounts: {},
};

const reducer: Reducer<BlockchainState, BlockchainAction> = (
  state = initialState,
  action: BlockchainAction,
) => {
  switch (action.type) {
    case getType(blockchainActions.initSuccess): {
      const { accounts } = action.payload;
      return { ...state, accounts };
    }
    case getType(blockchainActions.updateBnum): {
      const { bnum } = action.payload;
      return { ...state, blockNum: bnum };
    }
    case getType(blockchainActions.updateAccountSuccess): {
      const { account } = action.payload;
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [account.address]: account,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
