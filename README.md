# BizroadWebpackPlugin

| version name |            install package            | version |
| :----------: | :-----------------------------------: | :-----: |
|     prod     | npm install bizroad-webpack-plugin -D |  1.0.4  |

## notice

ensure your `node` version is `>10`, sorry about only support lts version node

- [x] support `TS`, `TSX`, `JSX`, `JS`
- [x] UI 1.0
- [x] support search `path` and find `what import` and `import what`
- [ ] support find useless `package` from `package.json`
- [ ] support find the `version` which in `package.json`, should be updated or dangerous

## install

```bash
npm install bizroad-webpack-plugin -D

# or use yarn
yarn add bizroad-webpack-plugin -D
```

## usage

```js
// webpack.config.js with require
const { BizroadWebpackPlugin } = require('bizroad-webpack-plugin');

module.exports = {
  // ...configs
  plugins: [
    new BizroadWebpackPlugin(),
    // ...other plugins
  ],
};
```

```js
// webpack.config.js with import
// webpack cli version > 4.35
import { BizroadWebpackPlugin } from 'bizroad-webpack-plugin';

export default {
  // ...configs
  plugins: [
    new BizroadWebpackPlugin(),
    // ...other plugins
  ],
};
```

## params

|     key      |  type  |                                    default                                     |         introduction         |
| :----------: | :----: | :----------------------------------------------------------------------------: | :--------------------------: |
|     name     | String |                                   'bizroad'                                    |       output dir name        |
|  outputPath  | String |                                       ''                                       |       output dir path        |
| parsePlugins | Array  | ['jsx', 'dynamicImport', 'classProperties', 'typescript', 'decorators-legacy'] | `@babel/parser` support type |

## For Test

```bash
npm install
npm run test
# open bizroad/index.html
```

then open your browser: [http://localhost:1208](http://localhost:1208)

A sankey of your project's business load will show

## Author

charlesmoone, meng5994197@gmail.com

## Contributors

welcome new Github guy ～ 🎉🎉🎉

**jijiaxin1808**
