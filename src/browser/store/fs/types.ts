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

export const enum FSActionTypes {
  INIT = '@fs/INIT',
  INIT_SUCCESS = '@fs/INIT_SUCCESS',
  INIT_ERROR = '@fs/INIT_ERROR',
  ADD = '@fs/ADD',
  ADD_SUCCESS = '@fs/ADD_SUCCESS',
  ADD_ERROR = '@fs/ADD_ERROR',
  CHECK = '@fs/CHECK',
  CHECK_SUCCESS = '@fs/CHECK_SUCCESS',
  CHECK_ERROR = '@fs/CHECK_ERROR',
  UPDATE = '@fs/UPDATE',
  UPDATE_SUCCESS = '@fs/UPDATE_SUCCESS',
  UPDATE_ERROR = '@fs/UPDATE_ERROR',
  DELETE = '@fs/DELETE',
  DELETE_SUCCESS = '@fs/DELETE_SUCCESS',
  DELETE_ERROR = '@fs/DELETE_ERROR',
  SET_SELECTED_CONTRACT = '@fs/SET_SELECTED_CONTRACT',
}

export interface ContractSrcFile {
  id: string;
  displayName: string;
  code: string;
  error?: any;
}

export interface FSState {
  error: boolean;
  loading: boolean;
  contracts: { [key: string]: ContractSrcFile };
  activeContract: string;
}
