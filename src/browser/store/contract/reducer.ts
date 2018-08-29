import BN from 'bn.js';
import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as contractActions from './actions';
import { Contract as ContractState } from './types';

type ContractAction = ActionType<typeof contractActions>;

const initialState: ContractState = {
  isChecking: false,
  isExecuting: false,
  balance: new BN(0),
  code: '',
  abi: null,
  state: {},
};

const contractReducer: Reducer<ContractState, ContractAction> = (state = initialState, action) => {
  switch (action.type) {
    case getType(contractActions.check): {
      return { ...state, isChecking: true, code: action.payload.code };
    }

    case getType(contractActions.checkSuccess): {
      return { ...state, isChecking: false, abi: action.payload.abi };
    }

    default:
      return state;
  }
};

export default contractReducer;
