const TYPE_ERR_RE = new RegExp(/\[.*.scilla\:([0-9]+\:[0-9]+)\] ?(.*)$/);
const SYN_ERR_RE = new RegExp(/^Syntax error.*line ([0-9]+)\, position ([0-9]+)/);

export class ScillaCheckerError extends Error {
  static isScillaError(obj: any): obj is ScillaCheckerError {
    return obj.line && obj.column && obj.msg;
  }

  line: string;
  column: string;
  msg: string;

  constructor(line: string, column: string, msg: string) {
    super();
    this.line = line;
    this.column = column;
    this.msg = msg;
  }

  toString() {
    return `An error occured at line ${this.line}, column ${this.column}: ${this.msg}`;
  }
}

export const parseSyntaxError = (out: string): ScillaCheckerError | null => {
  const error = SYN_ERR_RE.exec(out);

  if (error) {
    const [, line, column] = error;
    if (line && column) {
      return new ScillaCheckerError(line, column, 'Syntax error');
    }
  }

  return null;
};

export const parseTypeError = (out: string): ScillaCheckerError | null => {
  const trace: string[] = out
    .split('\n')
    .filter((ln) => !!ln)
    .slice(1)
    .map((err, index, self) => {
      if (index === 0 || index % 2 !== 0) {
        return `${err} ${self[index + 1]}`;
      }

      return '';
    })
    .filter((err) => !!err);
  const rawError = trace[trace.length - 1].replace(/\t\r\n/g, '').trim();
  const match = TYPE_ERR_RE.exec(rawError);

  if (match) {
    const [line, column] = match[1].split(':');
    const message = match[2];

    return new ScillaCheckerError(line, column, message);
  }

  return null;
};
