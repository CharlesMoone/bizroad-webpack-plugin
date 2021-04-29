import fs from 'fs';

import { IBizroadOptions } from '../types';

const vueReadFile = (file: string) => {
  const start = file.indexOf('<script');
  if (start === -1) {
    return '';
  }
  const _tmpFile = file.slice(start);
  const reg = _tmpFile.match(
    /<script(?:\s+[^\u007F-\u009F "'>/=]+(?:=\s*(?:[^\s"'=<>`]+|'[^']+'|"[^"]+"))?)*\s*>/,
  )?.[0];
  const end = file.lastIndexOf('</script>');
  const _file = file.slice(start + (reg?.length || 0), end);

  return _file;
};

export const readFile = (path: string, { specialSuffix }: IBizroadOptions) => {
  let file = fs.readFileSync(path, { encoding: 'utf-8' });

  const suffix = path.split('.').reverse()[0];
  if (specialSuffix.includes(`.${suffix}`)) {
    if (suffix === 'vue') {
      file = vueReadFile(file);
    }
  }

  return file;
};
