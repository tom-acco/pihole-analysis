import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: ["www/*"]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs"
        }
    },
    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    pluginJs.configs.recommended,
    {
        plugins: {
            "@stylistic": stylistic
        }
    },
    {
        rules: {
            "no-undef": "error",
            "@stylistic/indent": ["error", 4],
            "no-async-promise-executor": "error"
        }
    },
    eslintConfigPrettier
];
