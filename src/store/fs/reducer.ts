import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as fsActions from './actions';
import { FSState } from './types';

export type FsAction = ActionType<typeof fsActions>;

const initialState: FSState = {
  error: false,
  loading: true,
  contracts: {},
  activeContract: '',
};

const fsReducer: Reducer<FSState, FsAction> = (state = initialState, action) => {
  switch (action.type) {
    case getType(fsActions.init): {
      return { ...state, loading: true };
    }

    case getType(fsActions.initSuccess): {
      return {
        ...state,
        contracts: {
          ...state.contracts,
          ...action.payload.contracts.reduce((acc, contract) => {
            return { ...acc, [contract.address]: contract };
          }, {}),
        },
      };
    }

    case getType(fsActions.addSuccess): {
      return {
        ...state,
        contracts: { ...state.contracts, [action.payload.address]: action.payload },
        loading: false,
      };
    }

    case getType(fsActions.setSelectedContract): {
      return {
        ...state,
        activeContract: action.payload.address,
      };
    }

    default:
      return state;
  }
};

export default fsReducer;
