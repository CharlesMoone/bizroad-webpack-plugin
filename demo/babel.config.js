module.exports = api => {
  api && api.cache.forever();

  const presets = [
    ['@babel/preset-env', { targets: '> 2.486%, not dead' }],
    '@babel/preset-react',
    ['@babel/preset-typescript'],
  ];

  return { presets };
};
