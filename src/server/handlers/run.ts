import { Request, Response, NextFunction } from 'express';
import uuid from 'uuid/v4';

import { runner, makeTempFileName, writeFiles } from '../util';
import { ScillaError } from '../util/error';
import { Paths } from '../constants';

export const run = async (req: Request, res: Response, next: NextFunction) => {
  const id = uuid();
  const checkOpt = {
    code: makeTempFileName(id, 'scilla'),
    init: makeTempFileName(id, 'json', 'init'),
    blockchain: makeTempFileName(id, 'json', 'blockchain'),
    state: makeTempFileName(id, 'json', 'state'),
    message: makeTempFileName(id, 'json', 'message'),
    output: makeTempFileName(id, 'json', 'output'),
    stdlib: Paths.STDLIB,
  };

  const toWrite = Object.keys(checkOpt)
    .filter((k) => k !== 'stdlib')
    .map<{ path: string; data: string }>((k: string) => ({
      path: checkOpt[<keyof typeof checkOpt>k],
      data: req.body[k] || '',
    }));

  try {
    await writeFiles(toWrite);
    const result = await runner(checkOpt);

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
