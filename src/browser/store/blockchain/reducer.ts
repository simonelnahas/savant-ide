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
    case getType(blockchainActions.adjustBalance): {
      const { address, amount } = action.payload;
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [address]: {
            ...state.accounts[address],
            balance: amount,
          },
        },
      };
    }
    default:
      return state;
  }
};

export { reducer as blockchainReducer };
