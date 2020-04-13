module.exports = {
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        paths: ['./src'],
        extensions: [
          '.ts',
          '.js',
        ],
      },
    },
  },

  rules: {
    'semi-style': 'off',
    'import/prefer-default-export': 'off',
  },
  env: {
    node: true,
  },
};
