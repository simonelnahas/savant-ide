import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import { Paths } from '../constants';

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
  const cmd = `
    ${Paths.RUNNER} \
      -init ${opts.init} \
      -iblockchain ${opts.blockchain} \
      -istate ${opts.state} \
      -imessage ${opts.message} \
      -o ${opts.output} \
      -i ${opts.code} \
      -libdir ${opts.stdlib}
  `;

  const { stderr } = await execAsync(cmd);

  if (stderr) {
    throw new Error(stderr);
  }

  const result = await getOutput(opts.output);
  await cleanUp(opts);

  return result;
};

/**
 * async
 *
 * @param {CheckOpt} opts
 * @returns {undefined}
 */
export const checker = async (opts: BaseOpt) => {
  const cmd = `${Paths.CHECKER} ${opts.code} ${opts.stdlib}`;

  try {
    const { stdout } = await execAsync(cmd);
    await cleanUp(opts);

    return stdout;
  } catch (err) {
    throw new Error(err);
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
      return file !== 'stdlib';
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
  console.log(buf.toString());

  return JSON.parse(buf.toString());
};
