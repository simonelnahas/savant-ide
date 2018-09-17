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

const TYPE_ERR_RE = new RegExp(/.*\[(?:.*)?\:([0-9]+\:[0-9]+)\]\:? ((.*)\n?(.*)?)$/);
const SYN_ERR_RE = new RegExp(/^Syntax error.*line ([0-9]+)\, position ([0-9]+)/);
const GAS_ERR_RE = new RegExp(/Ran out of gas/g);

export const IS_SCILLA_SENTINEL = '@@__SCILLA_ERROR__@@';

interface ErrorObj {
  line: number;
  column: number;
  msg: string;
}

export class ScillaError extends Error {
  static isScillaError(obj: any): obj is ScillaError {
    return obj[IS_SCILLA_SENTINEL];
  }

  [IS_SCILLA_SENTINEL]: boolean = true;
  messages: ErrorObj[];

  constructor(messages: ErrorObj[]) {
    super();
    this.messages = messages;
  }

  toString() {
    return this.messages
      .map((eObj) => `An error occured at line ${eObj.line}, column ${eObj.column}: ${eObj.msg}`)
      .join('\n');
  }
}

export const parseExecutionError = (out: string): ScillaError | null => {
  if (GAS_ERR_RE.exec(out)) {
    return new ScillaError([{ line: 0, column: 0, msg: 'Out of gas!' }]);
  }
  const error = out.split('\n');

  if (error && error.length > 0) {
    const [, msg] = error;
    return new ScillaError([
      {
        line: 0,
        column: 0,
        msg,
      },
    ]);
  }

  return null;
};

export const parseSyntaxError = (out: string): ScillaError | null => {
  const error = SYN_ERR_RE.exec(out);

  if (error) {
    const [, line, column] = error;
    if (line && column) {
      return new ScillaError([
        {
          line: parseInt(line, 10),
          column: parseInt(column, 10),
          msg: `[${line}:${column}]: Syntax error`,
        },
      ]);
    }
  }

  return null;
};

export const parseTypeError = (out: string): ScillaError | null => {
  const trace: string[][] = out
    .split(/(?<!\:)\n{2,3}/)
    .filter((ln) => !!ln)
    .map((err) => {
      const replaced = err.replace(/\[/g, '@@[');
      return replaced.split('@@').filter((ln) => !!ln);
    })
    .slice(1)
    .filter((msg) => !!msg);

  const eObjs = trace
    .map((err) => {
      const [x, ...xs] = err;
      const matchX = TYPE_ERR_RE.exec(x.trim());

      if (!matchX) {
        throw new Error(`Could not parse error ${out}`);
      }

      const [line, column] = matchX && matchX[1].split(':');

      const msg = xs.length
        ? xs
            .map((msg) => {
              if (!msg) {
                return null;
              }

              const trimmed = msg.replace(/\t\r\n/g, '').trim();
              const match = TYPE_ERR_RE.exec(trimmed);

              if (match) {
                const [lineXs, colXs] = match[1].split(':');
                return `[${lineXs}:${colXs}]: ${match[2]}`;
              }

              return null;
            })
            .filter((x) => !!x)
            .join('\n')
        : '';

      const eObj = {
        line: parseInt(line, 10),
        column: parseInt(column, 10),
        msg: `[${line}:${column}]: ${matchX[2]}${msg ? '\n' + msg : ''}`,
      };

      return eObj;
    })
    .filter((obj) => !!obj);

  if (eObjs.length) {
    return new ScillaError(eObjs);
  }

  return null;
};
