import fs from 'fs';
import path from 'path';

import { IBizroadOptions, queueFormType } from '../types';

/**
 * 写入 bizroad.json
 */
const writeBizroadJSON = (dir: string, name: string, links: queueFormType): void => {
  fs.writeFileSync(path.resolve(dir, `${name}.json`), JSON.stringify(links, null, 2), {
    encoding: 'utf-8',
  });
};

const writePackageJSON = (dir: string, name: string, packageSet: Set<string>) => {
  fs.writeFileSync(
    path.resolve(dir, `${name}.package.json`),
    JSON.stringify(Object.fromEntries(Array.from(packageSet).map(i => [i, null])), null, 2),
    {
      encoding: 'utf-8',
    },
  );
};

const copyHtmlFromAssets = (links: queueFormType): string => {
  return fs
    .readFileSync(path.resolve(__dirname, '../assets/index.html'), {
      encoding: 'utf-8',
    })
    .replace(/\$\$_data_\$\$/, JSON.stringify(links));
};

const writeBizroadHTML = (dir: string, links: queueFormType) => {
  const html = copyHtmlFromAssets(links);

  /**
   * 写入代码到 html 里
   */
  fs.writeFileSync(`${dir}/index.html`, html, {
    encoding: 'utf-8',
  });
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

  writeBizroadJSON(dir, name, links);

  writePackageJSON(dir, name, packageSet);

  writeBizroadHTML(dir, links);
};
