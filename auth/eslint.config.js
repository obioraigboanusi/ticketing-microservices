// eslint.config.js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Global ignores (replaces .eslintignore)
  {
    ignores: ["dist/", "node_modules/", "build/"],
  },

  // Base JS & TS Rules
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Custom Configuration for Project Files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Enables eslint-plugin-prettier to surface formatting errors
      "prettier/prettier": "error",

      // Add your custom overrides here
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": "off",
    },
  },

  // Appends Prettier configuration to turn off conflicting rules
  eslintConfigPrettier,
);
