import traverse from '@babel/traverse';

import { File } from '@babel/types';

export default (babelAst: File | null) => {
  const nodePathList = new Set<string>();
  traverse(babelAst, {
    enter(path: any) {
      if (path.isImport()) {
        path.container.arguments[0].value && nodePathList.add(path.container.arguments[0].value);
      } else if (path.isImportDeclaration()) {
        path.node.source.value && nodePathList.add(path.node.source.value);
      } else if (path.isImportSpecifier()) {
        path.parent.source.value && nodePathList.add(path.parent.source.value);
      } else if (path.isIdentifier({ name: 'require' })) {
        if (path.container.type === 'CallExpression')
          path.container.arguments[0].value && nodePathList.add(path.container.arguments[0].value);
      }
    },
  });

  return Array.from(nodePathList);
};
