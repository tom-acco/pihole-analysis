import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: ["www/*", "dist/*", "node_modules/*"]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.node
            }
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json"
            },
            globals: {
                ...globals.node
            }
        }
    },
    {
        plugins: {
            "@stylistic": stylistic
        }
    },
    {
        rules: {
            "@stylistic/indent": ["error", 4],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/no-explicit-any": "warn"
        }
    },
    eslintConfigPrettier
];
