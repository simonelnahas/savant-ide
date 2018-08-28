export const checkContract = (contract: string) => {
  return fetch('http://localhost:8080/contract/check', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: contract }),
    method: 'POST',
  });
};
