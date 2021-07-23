import path from 'path';
import fs from 'fs';

import { fileCheck } from './fileCheck';

import { IBizroadOptions } from '../types';

export const findFile = (dir: string, target: string, extensions: string[]) => {
  try {
    const dirFileList = fs.readdirSync(dir);
    const suffix = target.split('.').reverse()[0];
    if (extensions.includes(`.${suffix}`)) {
      return dirFileList.find(file => target === file);
    }

    const findFile = extensions.map(extension => `${target}${extension}`);
    return dirFileList.find(file => findFile.includes(file));
  } catch (err) {
    return false;
  }
};

export const mergeFilepath = (mergePath: string, filepath: string, { alias, extensions }: IBizroadOptions) => {
  let synthesisPath = filepath;
  let status = false;

  const [aliasPathKey, ...synthesisPathKey] = filepath.split('/');
  const aliasPath = alias?.[aliasPathKey];
  if (aliasPath) synthesisPath = path.resolve(aliasPath, ...synthesisPathKey);

  if (!fileCheck(synthesisPath)) {
    status = true;
    const brokenPath = path.resolve(mergePath, '../', synthesisPath);

    try {
      const isDir = fs.lstatSync(brokenPath).isDirectory();
      /**
       * 这里一定要先执行，是为了 throw error 进入下面的流程
       */
      const realFile = findFile(brokenPath, 'index', extensions);

      if (isDir && realFile) synthesisPath = `${brokenPath}/${realFile}`;
    } catch (err) {
      const higherDir = path.resolve(brokenPath, '..');
      const targetFile = brokenPath.split('/').reverse()[0];

      let realFile = findFile(higherDir, targetFile, extensions);
      if (!realFile) {
        status = false;
        realFile = targetFile;
      }
      synthesisPath = `${higherDir}/${realFile}`;
    }
  }

  return { synthesisPath, status };
};
