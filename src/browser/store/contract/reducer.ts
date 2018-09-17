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

import * as contractActions from './actions';
import { Contract, ContractState } from './types';
import fastHash from 'murmurhash3js';

type ContractAction = ActionType<typeof contractActions>;

const initialState: ContractState = {
  error: false,
  isLoading: false,
  isDeployingContract: false,
  isCallingTransition: false,
  active: { address: '', isChecking: false, isExecuting: false },
  contracts: {},
  events: {},
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

    // for now, just put the entire store into an error state.
    case getType(contractActions.initError): {
      return { ...state, isLoading: false, error: true };
      break;
    }

    case getType(contractActions.deploy): {
      return { ...state, isDeployingContract: true };
    }

    case getType(contractActions.deploySuccess): {
      const { contract } = action.payload;
      const newIndex = { ...state.contracts, [contract.address]: contract };

      return { ...state, contracts: newIndex, isDeployingContract: false };
    }

    case getType(contractActions.deployError): {
      return { ...state, isDeployingContract: false };
    }

    case getType(contractActions.call): {
      return { ...state, isCallingTransition: true };
    }

    case getType(contractActions.callSuccess): {
      const { address, contract } = action.payload;
      const newIndex = { ...state.contracts, [address]: contract };
      return { ...state, contracts: newIndex, isCallingTransition: false };
    }

    case getType(contractActions.addEvent): {
      const { address, name, event } = action.payload;
      const id = fastHash.x86.hash32(address + name + JSON.stringify(event));

      return { ...state, events: { ...state.events, [id]: { address, name, event } } };
    }

    case getType(contractActions.clearEvent): {
      const { id } = action.payload;
      const { [id]: evt, ...rest } = state.events;

      return { ...state, events: { ...rest } };
    }

    default:
      return state;
  }
};

export default contractReducer;
