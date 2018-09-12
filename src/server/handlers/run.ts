import { Request, Response, NextFunction } from 'express';
import uuid from 'uuid/v4';

import { runner, makeTempFileName, writeFiles } from '../util';
import { ScillaError } from '../util/error';
import { Paths, OptionalRunnerOpts } from '../constants';

export const run = async (req: Request, res: Response, next: NextFunction) => {
  const id = uuid();

  const baseRunOpt = {
    code: makeTempFileName(id, 'scilla'),
    init: makeTempFileName(id, 'json', 'init'),
    blockchain: makeTempFileName(id, 'json', 'blockchain'),
    output: makeTempFileName(id, 'json', 'output'),
    stdlib: Paths.STDLIB,
    gaslimit: req.body.gaslimit,
  };

  const runOpt = OptionalRunnerOpts.reduce((opts, opt) => {
    return !!req.body[opt] ? { ...opts, [opt]: makeTempFileName(id, 'json', opt) } : opts;
  }, baseRunOpt);

  const toWrite = Object.keys(runOpt)
    .filter((k) => k !== 'stdlib' && k !== 'gaslimit')
    .map<{ path: string; data: string }>((k: string) => ({
      path: runOpt[<keyof typeof runOpt>k],
      data: req.body[k] || '',
    }));

  try {
    await writeFiles(toWrite);
    const result = await runner(runOpt);

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
