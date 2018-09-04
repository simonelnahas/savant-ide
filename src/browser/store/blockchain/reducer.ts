import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as blockchainActions from './actions';
import { BlockchainState } from './types';

type BlockchainAction = ActionType<typeof blockchainActions>;

const initialState: BlockchainState = {
  error: null,
  loading: false,
  blockNum: 0,
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
