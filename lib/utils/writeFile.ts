import fs from 'fs';
import path from 'path';

import { IBizroadOptions, queueFormType } from '../types';

const copyNextLocalServer = (dir: string, name: string, links: queueFormType) => {
  fs.cpSync(path.resolve(__dirname, '../.next'), path.resolve(dir, './.next'), {
    recursive: true,
  });

  const getAllFileStreamFile = fs
    .readFileSync(path.resolve(__dirname, '../.next/server/pages/api/stream/getAllFileStream.js'), {
      encoding: 'utf-8',
    })
    .replace(/\`\$\$__TEMP__STREAM__\$\$\`/, JSON.stringify(links));

  fs.writeFileSync(path.resolve(dir, './.next/server/pages/api/stream/getAllFileStream.js'), getAllFileStreamFile, {
    encoding: 'utf-8',
  });
};

const writePackageJSON = (dir: string, name: string, packageSet: Set<string>) => {
  fs.writeFileSync(
    path.resolve(dir, `${name}.package.json`),
    JSON.stringify(Object.fromEntries(Array.from(packageSet).map((i) => [i, null])), null, 2),
    {
      encoding: 'utf-8',
    },
  );
};

export const writeFile = (
  links: queueFormType,
  packageSet: Set<string>,
  { context, outputPath, name }: IBizroadOptions,
) => {
  let dir = path.resolve(context, outputPath, name);
  try {
    fs.lstatSync(dir).isDirectory();
  } catch (err) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }

  copyNextLocalServer(dir, name, links);

  writePackageJSON(dir, name, packageSet);
};
