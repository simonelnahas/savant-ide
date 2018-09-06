import auction from './auction.scilla';
import bookstore from './bookstore.scilla';
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
  { name: 'auction', src: auction },
  { name: 'bookstore', src: bookstore },
  { name: 'fungibleToken', src: fungibleToken },
  { name: 'helloWorld', src: helloWorld },
  { name: 'nonFungibleToken', src: nonFungibleToken },
  { name: 'schnorr', src: schnorr },
  { name: 'zilGame', src: zilGame },
];
