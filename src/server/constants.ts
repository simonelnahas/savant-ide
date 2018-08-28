import path from 'path';
import fs from 'fs';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

export const Paths = {
  CHECKER: resolveApp('scilla/bin/scilla-checker'),
  RUNNER: resolveApp('scilla/bin/scilla-runner'),
  STDLIB: resolveApp('scilla/src/stdlib/'),
};

