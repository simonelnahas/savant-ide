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
          return { ...acc, [contract.id]: contract };
        },
        {} as { [id: string]: ContractSrcFile },
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
        contracts: { [action.payload.id]: action.payload, ...state.contracts },
        loading: false,
      };
    }

    case getType(fsActions.setSelectedContract): {
      return {
        ...state,
        activeContract: action.payload.id,
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
        (acc, id) => {
          if (id === action.payload.id) {
            return acc;
          }

          return { ...acc, [id]: state.contracts[id] };
        },
        {} as { [id: string]: ContractSrcFile },
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
          [action.payload.id]: action.payload,
        },
      };
    }

    default:
      return state;
  }
};

export default fsReducer;
