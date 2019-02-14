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
