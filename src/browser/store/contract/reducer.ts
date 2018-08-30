import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as contractActions from './actions';
import { Contract, ContractState } from './types';

type ContractAction = ActionType<typeof contractActions>;

const initialState: ContractState = {
  error: false,
  isLoading: false,
  active: { address: '', isChecking: false, isExecuting: false },
  contracts: {},
};

const contractReducer: Reducer<ContractState, ContractAction> = (state = initialState, action) => {
  switch (action.type) {
    case getType(contractActions.init): {
      return { ...state, isLoading: true };
    }

    case getType(contractActions.initSuccess): {
      const index = action.payload.contracts.reduce(
        (acc, cntr) => {
          return { ...acc, [cntr.address]: cntr };
        },
        {} as { [address: string]: Contract },
      );

      return { ...state, contracts: index, isLoading: false };
    }

    case getType(contractActions.deploy): {
      return { ...state, isLoading: true };
    }

    case getType(contractActions.deploySuccess): {
      const { contract } = action.payload;
      const newIndex = { ...state.contracts, [contract.address]: contract };

      return { ...state, contracts: newIndex, isLoading: false };
    }

    // for now, just put the entire store into an error state.
    case getType(contractActions.initError):
    case getType(contractActions.deployError): {
      return { ...state, isLoading: false, error: true };
      break;
    }

    default:
      return state;
  }
};

export default contractReducer;
