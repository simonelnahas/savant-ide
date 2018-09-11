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
  state: string;
  message: string;
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
  console.log(opts);
  const cmd = `${Paths.RUNNER} \
      -i ${opts.code} \
      -libdir ${opts.stdlib} \
      -o ${opts.output} \
      -init ${opts.init} \
      -imessage ${opts.message} \
      -istate ${opts.state} \
      -iblockchain ${opts.blockchain} \
      -gaslimit ${opts.gaslimit}
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
