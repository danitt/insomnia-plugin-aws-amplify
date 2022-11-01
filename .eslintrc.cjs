module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'prettier', 'unused-imports'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      modules: true,
    },
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.cjs'],
  },
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'prettier/prettier': ['error', { singleQuote: true }],
    'import/order': [
      'error',
      { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
    ],
    'import/no-unresolved': [
      2,
      { ignore: ['^@[src|test|dabblesports|pulumi]'] },
    ],
    'unused-imports/no-unused-imports': 'error',
    'import/export': 'off', // Buggy: https://github.com/import-js/eslint-plugin-import/issues/2228
    eqeqeq: 2,
    'no-console': 2,
    'no-unused-expressions': 2, // no short-circuit eval, e.g. `!!x && (() => ...)`
  },
};
