import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{js,mjs,jsx,vue}"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser
      }
    }
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/www/**", "**/dist/**", "**/dist-ssr/**", "**/coverage/**"]
  },

  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/strongly-recommended"],

  {
    rules: {
      indent: "off",
      "vue/script-indent": ["error", 4, { baseIndent: 1, switchCase: 1, ignores: [] }],
      "vue/html-indent": [
        "error",
        4,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: []
        }
      ],
      "vue/valid-v-slot": [
        "error",
        {
          allowModifiers: true
        }
      ]
    }
  },

  eslintConfigPrettier
];
