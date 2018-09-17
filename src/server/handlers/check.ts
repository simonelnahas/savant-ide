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

import { Request, Response, NextFunction } from 'express';
import uuid from 'uuid/v4';

import { checker, makeTempFileName, writeFiles } from '../util';
import { ScillaError } from '../util/error';
import { Paths } from '../constants';

export const check = async (req: Request, res: Response, next: NextFunction) => {
  const id = uuid();
  const checkOpt = {
    code: makeTempFileName(id, 'scilla'),
    stdlib: Paths.STDLIB,
  };

  const toWrite = Object.keys(checkOpt)
    .filter((file) => file !== 'stdlib')
    .map<{ path: string; data: string }>((k: string) => ({
      path: checkOpt[<keyof typeof checkOpt>k],
      data: req.body[k] || '',
    }));

  try {
    await writeFiles(toWrite);
    const result = await checker(checkOpt);

    res.status(200).json({
      result: 'success',
      message: result,
    });
  } catch (err) {
    if (ScillaError.isScillaError(err)) {
      res.status(400).json({
        result: 'error',
        message: err.messages,
      });
      return;
    }

    res.status(400).json({
      result: 'error',
      message: err.message,
    });
  }
};
