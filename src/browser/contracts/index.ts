import auction from './auction.scilla';
import bookstore from './bookstore.scilla';
import crowdfunding from './crowdfunding.scilla';
import fungibleToken from './fungible_token.scilla';
import helloWorld from './hello_world.scilla';
import nonFungibleToken from './nonfungible_token.scilla';
import schnorr from './schnorr.scilla';
import zilGame from './zil_hash_game.scilla';

interface ScillaSrc {
  name: string;
  src: string;
}

export const defaultContracts: ScillaSrc[] = [
  { name: 'HelloWorld', src: helloWorld },
  { name: 'BookStore', src: bookstore },
  { name: 'CrowdFunding', src: crowdfunding },
  { name: 'Auction', src: auction },
  { name: 'FungibleToken', src: fungibleToken },
  { name: 'NonFungible', src: nonFungibleToken },
  { name: 'ZilGame', src: zilGame },
  { name: 'SchnorrTest', src: schnorr },
];
