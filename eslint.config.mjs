import reactPlugin from "eslint-plugin-react";
import noRelativeImportPlugin from "eslint-plugin-no-relative-import-paths";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";

const config = [
    prettierPluginRecommended,
    {
        files: ["app/**/*.{ts,tsx,js,jsx}"],
        ignores: [".vinxi/**/*", ".output/**/*", "postcss.config.cjs"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: { modules: true },
                ecmaVersion: "latest",
                project: "./tsconfig.json",
                sourceType: "module",
            },
        },
        plugins: {
            react: reactPlugin,
            "no-relative-import-paths": noRelativeImportPlugin,
            "simple-import-sort": simpleImportSortPlugin,
            "unused-imports": unusedImportsPlugin,
            import: importPlugin,
            prettier: prettierPlugin,
            "@typescript-eslint": ts,
            ts,
        },
        rules: {
            ...reactPlugin.configs["jsx-runtime"].rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/jsx-uses-vars": "error",
            "react/jsx-key": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "typeLike",
                    format: ["StrictPascalCase"],
                },
                {
                    selector: "typeParameter",
                    format: ["PascalCase"],
                },
                {
                    selector: "interface",
                    format: ["StrictPascalCase"],
                },
            ],
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/no-unsafe-argument": "error",
            "@typescript-eslint/require-await": "error",
            "@typescript-eslint/restrict-plus-operands": "error",
            "@typescript-eslint/restrict-template-expressions": "error",
            "@typescript-eslint/unbound-method": "off",
            "no-relative-import-paths/no-relative-import-paths": [
                "error",
                {
                    allowSameFolder: false,
                    rootDir: "src/",
                    prefix: "",
                },
            ],
            "simple-import-sort/imports": "error",
            "unused-imports/no-unused-imports": "error",
            "import/no-default-export": "error",
            "prettier/prettier": "error",
            "no-unused-vars": "off",
            "no-extra-boolean-cast": "off",
            "no-console": "error",
            "prefer-destructuring": "error"
        },
    },
    // overrides
    {
        files: ["vite.config.ts"],
        rules: {
            "import/no-default-export": "off",
        },
    },
];

export default config;
