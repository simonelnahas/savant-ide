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
