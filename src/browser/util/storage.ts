import { ContractSrcFile } from '../store/fs/types';

const DEFAULT_CONTRACTS = [
  'HelloWorld',
  'BookStore',
  'CrowdFunding',
  'Auction',
  'FungibleToken',
  'NonFungible',
  'ZilGame',
  'SchnorrTest',
];

export const extractDefault = (contracts: ContractSrcFile[]): ContractSrcFile[] => {
  const defaults: ContractSrcFile[] = [];

  const customs = contracts.filter((contract) => {
    if (DEFAULT_CONTRACTS.indexOf(contract.displayName) === -1) {
      return true;
    }

    defaults.push(contract);
    return false;
  });

  return [
    ...customs,
    ...defaults.sort(
      (fst, snd) =>
        DEFAULT_CONTRACTS.indexOf(fst.displayName) > DEFAULT_CONTRACTS.indexOf(snd.displayName)
          ? 1
          : -1,
    ),
  ];
};
