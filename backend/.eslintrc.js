module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // ✅ This enables eslint-plugin-prettier + config-prettier
  ],
  rules: {
    'prettier/prettier': 'error' // ✅ Shows Prettier issues as ESLint errors
  }
};
