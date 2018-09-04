import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as fsActions from './actions';
import { ContractSrcFile, FSState } from './types';

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
      const contracts: { [key: string]: ContractSrcFile } = action.payload.contracts.reduce(
        (acc, contract) => {
          return { ...acc, [contract.name]: contract };
        },
        {} as { [name: string]: ContractSrcFile },
      );

      return {
        ...state,
        contracts,
        loading: false,
      };
    }

    case getType(fsActions.addSuccess): {
      return {
        ...state,
        contracts: { [action.payload.name]: action.payload, ...state.contracts },
        loading: false,
      };
    }

    case getType(fsActions.setSelectedContract): {
      return {
        ...state,
        activeContract: action.payload.address,
      };
    }

    case getType(fsActions.checkError): {
      const { error } = action.payload;
      const active = state.contracts[state.activeContract];

      if (error.response) {
        return {
          ...state,
          loading: false,
          contracts: {
            ...state.contracts,
            [state.activeContract]: { ...active, error: error.response },
          },
        };
      }

      return {
        ...state,
        loading: false,
        contracts: {
          ...state.contracts,
          [state.activeContract]: { ...active, error },
        },
      };
    }

    case getType(fsActions.deleteContractSuccess): {
      const filtered = Object.keys(state.contracts).reduce(
        (acc, name) => {
          if (name === action.payload.name) {
            return acc;
          }

          return { ...acc, [name]: state.contracts[name] };
        },
        {} as { [key: string]: ContractSrcFile },
      );

      return {
        ...state,
        contracts: filtered,
      };
    }

    case getType(fsActions.updateSuccess): {
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [action.payload.name]: action.payload,
        },
      };
    }

    default:
      return state;
  }
};

export default fsReducer;
