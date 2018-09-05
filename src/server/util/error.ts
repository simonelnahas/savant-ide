const TYPE_ERR_RE = new RegExp(/.*\[(?:.*)?\:([0-9]+\:[0-9]+)\]\:? ((.*)\n?(.*)?)$/);
const SYN_ERR_RE = new RegExp(/^Syntax error.*line ([0-9]+)\, position ([0-9]+)/);

export const IS_SCILLA_SENTINEL = '@@__SCILLA_ERROR__@@';

interface ErrorObj {
  line: number;
  column: number;
  msg: string;
}

export class ScillaCheckerError extends Error {
  static isScillaError(obj: any): obj is ScillaCheckerError {
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

export const parseSyntaxError = (out: string): ScillaCheckerError | null => {
  const error = SYN_ERR_RE.exec(out);

  if (error) {
    const [, line, column] = error;
    if (line && column) {
      return new ScillaCheckerError([
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

export const parseTypeError = (out: string): ScillaCheckerError | null => {
  const trace: string[][] = out
    .split(/\n{2,3}/)
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
        msg: `${matchX[2]}${msg ? '\n' + msg : ''}`,
      };

      return eObj;
    })
    .filter((obj) => !!obj);

  if (eObjs.length) {
    return new ScillaCheckerError(eObjs);
  }

  return null;
};
