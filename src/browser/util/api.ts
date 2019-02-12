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

import { TransitionCallResponse } from '../store/contract/types';

export interface ErrorObj {
  line: number;
  column: number;
  msg: string;
}

export interface ErrorMsg {
  result: 'error';
  message: ErrorObj[];
}

export interface ResponseMsg {
  result: 'success' | 'error';
  message: any;
}

export interface CallResponse extends Response {
  message: TransitionCallResponse;
}

export const enum Status {
  ERROR = 'error',
  SUCCESS = 'success',
}

const apiUrl = process.env.REACT_APP_SCILLA_API;

export const formatError = (error: any | ErrorObj[]) => {
  if (Array.isArray(error)) {
    return (<ErrorObj[]>error).map(({ msg }) => msg).join('\n');
  }

  return error.toString();
};

/**
 * Custom error class with response exposed.
 */
export class RequestError extends Error {
  response?: any;
  status: number;
}

const isJSON = (response: Response): boolean => {
  const contentType = response.headers.get('content-type');
  return !!contentType && contentType.indexOf('application/json') !== -1;
};

export const request = (url: string, options: RequestInit): Promise<Response> => {
  return new Promise((resolve, reject) => {
    fetch(url, options).then((response) => {
      const contentType = response.headers.get('content-type');

      if (response.status >= 200 && response.status < 400) {
        resolve(response);
      } else {
        const err = new RequestError(response.statusText);
        err.status = response.status;

        if (contentType && contentType.indexOf('application/json') !== -1) {
          response.json().then((errJson) => {
            err.response = errJson;
            reject(err);
          });
        } else {
          reject(err);
        }
      }
    });
  });
};

export const checkContract = (contract: string, signal?: AbortSignal) => {
  const defaults = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal,
  };

  return request(`${apiUrl}/contract/check`, {
    ...defaults,
    body: JSON.stringify({ code: contract }),
  }).then((res) => {
    if (isJSON(res)) {
      return res.json();
    } else {
      return res;
    }
  });
};

export const callContract = (payload: any, signal?: AbortSignal): Promise<CallResponse> => {
  const defaults = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal,
  };

  return request(`${apiUrl}/contract/call`, {
    ...defaults,
    body: JSON.stringify(payload),
  }).then((res) => {
    if (isJSON(res)) {
      return res.json();
    } else {
      return res;
    }
  });
};
