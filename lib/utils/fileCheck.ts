export const fileCheck = (path: string) => !/^[\.|\/]/.test(path) || path.includes('node_module');
