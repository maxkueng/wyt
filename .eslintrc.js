module.exports = {
  extends: [
    'airbnb-base',
    'plugin:flowtype/recommended',
  ],
  plugins: [
    'flowtype',
  ],
  rules: {
    'semi-style': 'off',
    'import/prefer-default-export': 'off',
  },
  env: {
    node: true,
  },
};
