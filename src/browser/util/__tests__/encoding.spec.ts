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

import BN from 'bn.js';
import { deserialise, withTypes } from '../encoding';

describe('encoding', () => {
  it('should handle large numbers correctly', () => {
    const datum = {
      vname: 'TestUint256',
      type: 'Uint256',
      value: '115792089237316195423570985008687907853269984665640564039457584007913129639936',
    };

    const res = deserialise(withTypes(datum));
    expect(res.toString()).toEqual(datum.value);
  });

  it('should convert Map K V to object { [key: K]: V }', () => {
    const datum = {
      vname: 'TestMap',
      type: 'Map (Address) (List (Pair (BNum) (String)))',
      value: [
        {
          key: '0x12345678901234567890123456789012345678ab',
          val: {
            constructor: 'Cons',
            argtypes: ['Pair (BNum) (String)'],
            arguments: [
              {
                constructor: 'Pair',
                argtypes: ['BNum', 'String'],
                arguments: ['8', 'eight'],
              },
              {
                constructor: 'Cons',
                argtypes: ['Pair (BNum) (String)'],
                arguments: [
                  {
                    constructor: 'Pair',
                    argtypes: ['BNum', 'String'],
                    arguments: ['8', 'eight'],
                  },
                  {
                    constructor: 'Cons',
                    argtypes: ['Pair (BNum) (String)'],
                    arguments: [
                      {
                        constructor: 'Pair',
                        argtypes: ['BNum', 'String'],
                        arguments: ['8', 'eight'],
                      },
                      {
                        constructor: 'Cons',
                        argtypes: ['Pair (BNum) (String)'],
                        arguments: [
                          {
                            constructor: 'Pair',
                            argtypes: ['BNum', 'String'],
                            arguments: ['8', 'eight'],
                          },
                          {
                            constructor: 'Cons',
                            argtypes: ['Pair (BNum) (String)'],
                            arguments: [
                              {
                                constructor: 'Pair',
                                argtypes: ['BNum', 'String'],
                                arguments: ['8', 'eight'],
                              },
                              {
                                constructor: 'Cons',
                                argtypes: ['Pair (BNum) (String)'],
                                arguments: [
                                  {
                                    constructor: 'Pair',
                                    argtypes: ['BNum', 'String'],
                                    arguments: ['8', 'eight'],
                                  },
                                  {
                                    constructor: 'Cons',
                                    argtypes: ['Pair (BNum) (String)'],
                                    arguments: [
                                      {
                                        constructor: 'Pair',
                                        argtypes: ['BNum', 'String'],
                                        arguments: ['8', 'eight'],
                                      },
                                      {
                                        constructor: 'Nil',
                                        argtypes: [],
                                        arguments: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    };

    const res = deserialise(withTypes(datum));
  });

  it('should convert List T of arbitrary length to Array<T>', () => {
    const datum = {
      vname: 'TestField',
      type: 'List (Pair (BNum) (String))',
      value: {
        constructor: 'Cons',
        argtypes: ['Pair (BNum) (String)'],
        arguments: [
          {
            constructor: 'Pair',
            argtypes: ['BNum', 'String'],
            arguments: ['8', 'eight'],
          },
          {
            constructor: 'Cons',
            argtypes: ['Pair (BNum) (String)'],
            arguments: [
              {
                constructor: 'Pair',
                argtypes: ['BNum', 'String'],
                arguments: ['8', 'eight'],
              },
              {
                constructor: 'Cons',
                argtypes: ['Pair (BNum) (String)'],
                arguments: [
                  {
                    constructor: 'Pair',
                    argtypes: ['BNum', 'String'],
                    arguments: ['8', 'eight'],
                  },
                  {
                    constructor: 'Cons',
                    argtypes: ['Pair (BNum) (String)'],
                    arguments: [
                      {
                        constructor: 'Pair',
                        argtypes: ['BNum', 'String'],
                        arguments: ['8', 'eight'],
                      },
                      {
                        constructor: 'Cons',
                        argtypes: ['Pair (BNum) (String)'],
                        arguments: [
                          {
                            constructor: 'Pair',
                            argtypes: ['BNum', 'String'],
                            arguments: ['8', 'eight'],
                          },
                          {
                            constructor: 'Cons',
                            argtypes: ['Pair (BNum) (String)'],
                            arguments: [
                              {
                                constructor: 'Pair',
                                argtypes: ['BNum', 'String'],
                                arguments: ['8', 'eight'],
                              },
                              {
                                constructor: 'Cons',
                                argtypes: ['Pair (BNum) (String)'],
                                arguments: [
                                  {
                                    constructor: 'Pair',
                                    argtypes: ['BNum', 'String'],
                                    arguments: ['8', 'eight'],
                                  },
                                  {
                                    constructor: 'Nil',
                                    argtypes: [],
                                    arguments: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const res = deserialise(withTypes(datum));
    const expected = [
      ['8', 'eight'],
      ['8', 'eight'],
      ['8', 'eight'],
      ['8', 'eight'],
      ['8', 'eight'],
      ['8', 'eight'],
      ['8', 'eight'],
    ];

    expect(res).toEqual(expected);
  });

  it('should convert arbitrarily complex Pair L R to [L, R]', () => {
    // This simulates the Scilla equivalent of Solidity
    // struct Player {
    //   uint128 playerId;
    //   address playerAddress;
    //   string name;
    //   uint256 unallocatedZeal;
    //   uint lastAttack;
    //   uint lastDefense;
    //   bool loggedIn;
    // }
    const datum = {
      vname: 'TestPair',
      type:
        'Pair (Pair(Pair(Uint128)(Address))(Pair(String)(Uint256))) (Pair(Pair(BNum)(BNum))(Pair(Bool)(Nat)))',
      value: {
        constructor: 'Pair',
        argtypes: [
          'Pair (Pair(Uint128) (Address)) (Pair(String) (Uint256))',
          'Pair (Pair(BNum) (BNum)) (Pair(Bool) (Nat))',
        ],
        arguments: [
          {
            constructor: 'Pair',
            argtypes: ['Pair (Uint128) (Address)', 'Pair (String) (Uint256)'],
            arguments: [
              {
                constructor: 'Pair',
                argtypes: ['Uint128', 'Address'],
                arguments: ['1', '0x12345678901234567890123456789012345678ab'],
              },
              {
                constructor: 'Pair',
                argtypes: ['String', 'Uint256'],
                arguments: ['Cloud', '12983471263845836455928349912348'],
              },
            ],
          },
          {
            constructor: 'Pair',
            argtypes: ['Pair (BNum) (BNum)', 'Pair (Bool) (Nat)'],
            arguments: [
              {
                constructor: 'Pair',
                argtypes: ['BNum', 'BNum'],
                arguments: ['2135692384781', '2135692384785'],
              },
              {
                constructor: 'Pair',
                argtypes: ['Bool', 'Nat'],
                arguments: [
                  { constructor: 'False' },
                  {
                    constructor: 'Succ',
                    argtypes: [],
                    arguments: [
                      {
                        constructor: 'Succ',
                        argtypes: [],
                        arguments: [
                          {
                            constructor: 'Succ',
                            argtypes: [],
                            arguments: [{ constructor: 'Zero' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const expected = [
      [
        ['1', '0x12345678901234567890123456789012345678ab'],
        ['Cloud', '12983471263845836455928349912348'],
      ],
      [['2135692384781', '2135692384785'], [false, 3]],
    ];

    const res = deserialise(withTypes(datum));
    expect(res).toEqual(expected);
  });
});
