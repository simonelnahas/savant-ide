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

export const checkContract = (contract: string) => {
  const defaults = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };

  return request('http://localhost:8080/contract/check', {
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
