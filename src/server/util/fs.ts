import fs from 'fs';
import { promisify } from 'util';

interface File {
  path: string;
  data: string;
}

const writeFile = promisify(fs.writeFile);

export const makeTempFileName = (id: string, extension: string, suffix?: string): string => {
  return `${process.env.PWD}/temp/${id}${suffix ? '_' + suffix : ''}.${extension}`;
};

/**
 * writeFiles
 *
 * asynchronously writes files to disk
 *
 * @param {File[]} files
 * @returns {Promise<any>}
 */
export const writeFiles = (files: File[]): Promise<any> => {
  console.warn('FILES', files);
  return Promise.all(
    files.map((file) => {
      return writeFile(file.path, file.data);
    }),
  );
};
