// eslint.config.js
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
      react,
      "react-hooks": reactHooks,
    },

    rules: {
      // JS recommended
      ...js.configs.recommended.rules,

      // TS recommended
      ...tseslint.configs.recommended.rules,

      // React recommended
      ...react.configs.recommended.rules,

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Custom rules
      "@typescript-eslint/no-unused-vars": "warn",
      "import/no-unresolved": "off",
      "import/extensions": "off",
      "import/prefer-default-export": "off",
    },

    settings: {
      react: { version: "18.0" },
      "import/resolver": {
        typescript: {},
      },
    },
  },
];
