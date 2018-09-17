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

import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import { Paths } from '../constants';
import { parseExecutionError, parseSyntaxError, parseTypeError, ScillaError } from '../util/error';

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
  const cmd = `${Paths.CHECKER} ${opts.code} ${opts.stdlib}`;

  try {
    const { stdout, stderr } = await execAsync(cmd);

    if (stderr.length) {
      const syntaxError = parseSyntaxError(stderr);

      if (syntaxError) {
        throw syntaxError;
      }

      throw new Error(stderr);
    }

    const typeError = parseTypeError(stdout);

    if (typeError) {
      throw typeError;
    }

    return stdout;
  } catch (err) {
    if (ScillaError.isScillaError(err)) {
      throw err;
    } else {
      throw new Error(err);
    }
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
