import path from 'path';
import webpack from 'webpack';

import analysisBabelAst from './analysisBabelAst';

import { file2babelAst, writeFile, fileCheck, readFile, handlePath, mergeFilepath } from './utils';

/**
 * type 导入
 */
import { Compiler } from 'webpack/types';

import { IBizroadOptions, queueFormType, queueType } from './types';

class BizroadWebpackPlugin {
  options: IBizroadOptions = {
    name: 'bizroad',
    outputPath: '',
    parsePlugins: ['jsx', 'dynamicImport', 'classProperties', 'typescript', 'decorators-legacy'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'],
    specialSuffix: ['.vue'],
    context: '',
  };

  entryFilesPath: string[];

  links: queueFormType;

  /**
   * 存储所有用到的 package
   */
  packageSet: Set<string>;

  constructor(options: IBizroadOptions) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.entryFilesPath = [];

    this.links = {};

    this.packageSet = new Set();
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterResolvers.tap('BizroadWebpackPlugin', async (compiler: Compiler) => {
      const {
        context = '',
        resolve: { alias },
      } = compiler.options;

      this.options.context = context;
      this.options.alias = alias;

      // @ts-ignore
      const normalizedEntry = webpack.config.getNormalizedWebpackOptions(compiler.options).entry;

      const entryFilesPath = Object.values(normalizedEntry).reduce<string[]>((prev, curr) => {
        if (curr.import) {
          const imports = curr.import.filter(path => !path.includes('node_modules'));
          prev.push(...imports);
        }

        return prev;
      }, []);

      entryFilesPath.forEach(this._handleEntryFilesPath.bind(this));

      writeFile(this.links, this.packageSet, this.options);
    });
  }

  _handleEntryFilesPath(entryFilepath: string) {
    if (fileCheck(entryFilepath)) {
      return false;
    }

    const options = this.options;

    const mergePath = path.resolve(options.context, entryFilepath);
    const file = readFile(mergePath, options);

    if (!file) return false;

    const ast = file2babelAst(file, options);

    const queue: queueType[] = [{ path: mergePath, ast, form: this.links }];
    const filepathSet = new Set<string>();

    do {
      const queueItem = queue.shift();
      if (!queueItem) break;

      const { path: _path, ast: babelAst, form: _form } = queueItem;
      if (!babelAst) continue;

      if (_form) _form[handlePath(_path, options)] = {};

      if (filepathSet.has(_path)) continue;

      filepathSet.add(_path);

      const nodePathList: string[] = analysisBabelAst(babelAst);
      nodePathList.forEach(filepath => {
        const { synthesisPath, status } = mergeFilepath(_path, filepath, options);

        if (!status) this.packageSet.add(synthesisPath);
        if (!status) return (_form[handlePath(_path, options)][handlePath(synthesisPath, options)] = {}), false;

        const fileInfo = readFile(synthesisPath, options);
        if (!fileInfo) return false;

        const astItem = file2babelAst(fileInfo, options);

        queue.push({
          path: synthesisPath,
          ast: astItem,
          form: _form[handlePath(_path, options)],
        });
      });
    } while (queue.length);

    // console.log('filepathSet', filepathSet);
  }
}

export { BizroadWebpackPlugin };
