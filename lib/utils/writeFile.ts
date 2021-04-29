import fs from 'fs';
import path from 'path';

import { IBizroadOptions, queueFormType } from '../types';

export const writeFile = (links: queueFormType, { context, outputPath, name }: IBizroadOptions) => {
  let dir = path.resolve(context, outputPath, name);
  try {
    fs.lstatSync(dir).isDirectory();
  } catch (err) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }

  /**
   * 写入 bizroad.json
   */
  fs.writeFileSync(path.resolve(dir, `${name}.json`), JSON.stringify(links, null, 2), {
    encoding: 'utf-8',
  });

  const html = fs
    .readFileSync(path.resolve(__dirname, '../assets/index.html'), {
      encoding: 'utf-8',
    })
    .replace(/\$\$_data_\$\$/, JSON.stringify(links));

  /**
   * 写入代码到 html 里
   */
  fs.writeFileSync(`${dir}/index.html`, html, {
    encoding: 'utf-8',
  });
};
