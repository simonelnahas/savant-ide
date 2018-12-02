/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pvt. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
 */

import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import { Paths } from '../constants';
import { parseExecutionError, parseCheckerError } from '../util/error';

const execAsync = promisify(exec);
const readAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

interface BaseOpt {
  code: string;
  stdlib: string;
}

interface RunOpt extends BaseOpt {
  init: string;
  blockchain: string;
  state?: string;
  message?: string;
  output: string;
  gaslimit: string;
}

/**
 * runner
 *
 * Asynchronously runs scilla-runner.
 *
 * @param {RunOpt} opts
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
export const runner = async (opts: RunOpt) => {
  // mandatory
  const { code, stdlib, init, blockchain, output, gaslimit, ...optional } = opts;

  const cmd = `${Paths.RUNNER} \
      -i ${code} \
      -libdir ${stdlib} \
      -o ${output} \
      -init ${init} \
      -iblockchain ${blockchain} \
      -gaslimit ${gaslimit} \
      ${optional.state ? '-istate ' + optional.state + ' \\' : ''}
      ${optional.message ? '-imessage ' + optional.message + ' \\' : ''}
  `;

  try {
    const { stderr } = await execAsync(cmd);

    if (stderr) {
      throw new Error(stderr);
    }

    const result = await getOutput(opts.output);
    return result;
  } catch (err) {
    const executionError = parseExecutionError(err.stderr);

    if (executionError) {
      throw executionError;
    }

    throw err;
  } finally {
    await cleanUp(opts);
  }
};

/**
 * checker
 *
 * Asynchronously invokes `scilla-checker`, returning JSON ABI or a ScillaError with the
 * parsed error output from the binary.
 *
 * @param {CheckOpt} opts
 * @returns {Promise<string>}
 */
export const checker = async (opts: BaseOpt) => {
  const cmd = `${Paths.CHECKER} -libdir ${opts.stdlib} -jsonerrors ${opts.code}`;

  try {
    const { stdout } = await execAsync(cmd);
    return stdout;
  } catch (err) {
    throw parseCheckerError(err.stdout);
  } finally {
    await cleanUp(opts);
  }
};

/**
 * cleanUp
 *
 * @param {RunOpt} files
 * @returns {Promise<void[]>}
 */
const cleanUp = async (files: Partial<RunOpt>) => {
  const paths = Object.keys(files)
    .filter((file) => {
      return file !== 'stdlib' && file !== 'gaslimit';
    })
    .map((file: string) => {
      return unlinkAsync(<string>files[<keyof RunOpt>file]);
    });

  return Promise.all(paths);
};

/**
 * getOutput
 *
 * @param {string} path
 * @returns {Promise<string>}
 */
const getOutput = async (path: string) => {
  const buf = await readAsync(path);

  return JSON.parse(buf.toString());
};
