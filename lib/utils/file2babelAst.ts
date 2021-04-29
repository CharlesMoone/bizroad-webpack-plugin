import { parse } from '@babel/parser';

import { IBizroadOptions } from '../types';

export const file2babelAst = (file: string, { parsePlugins }: IBizroadOptions): import('@babel/types').File | null => {
  try {
    return parse(file, {
      sourceType: 'module',
      plugins: parsePlugins,
    });
  } catch (err) {
    return null;
  }
};
