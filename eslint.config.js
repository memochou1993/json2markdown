import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: [
      '**/*.{js,mjs,cjs,ts}',
    ],
  },
  {
    ignores: [
      'dist/**/*',
    ],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'object-curly-spacing': ['error', 'always'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
];
