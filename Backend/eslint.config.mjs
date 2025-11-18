import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  resolvePluginsRelativeTo: import.meta.dirname,
});

export default [

  // 1. Base ESLint recommended
  eslint.configs.recommended,

  // 2. TypeScript recommended
  ...tseslint.configs.recommended,

  // 3. Airbnb-base using FlatCompat
  ...compat.extends('airbnb-base'),

  {
    files: ['**/*.ts'],
    ignores: ['dist/**'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    plugins: {
      import: importPlugin,
      '@typescript-eslint': tseslint.plugin,
    },

    rules: {
      // Fix import issues for TypeScript
      'import/no-unresolved': 'off',
      'import/extensions': 'off',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'warn',

      // Backend convenience
      'no-console': 'off',
      'import/prefer-default-export': 'off',
    },
  },
];
