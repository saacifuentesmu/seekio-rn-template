module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['debug-server.js', '*.config.js'],
      env: {node: true},
    },
  ],
  rules: {
    'import/no-unresolved': 'off',
    // TypeScript validates imports; the import plugin's static resolver
    // throws false positives on react-native's flow-typed source and on
    // some native modules' default exports.
    'import/namespace': 'off',
    'import/default': 'off',
    'import/order': ['warn', {'newlines-between': 'always'}],
    curly: ['warn', 'multi-line'],
  },
};
