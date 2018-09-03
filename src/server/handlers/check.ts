import { Request, Response, NextFunction } from 'express';
import uuid from 'uuid/v4';

import { checker, makeTempFileName, writeFiles } from '../util';
import { ScillaCheckerError } from '../util/error';
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
    if (ScillaCheckerError.isScillaError(err)) {
      res.status(400).json({
        result: 'error',
        line: err.line,
        column: err.column,
        message: err.msg,
      });
      return;
    }

    res.status(400).json({
      result: 'error',
      message: err.message,
    });
  }
};
