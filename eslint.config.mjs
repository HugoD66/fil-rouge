// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import n from "eslint-plugin-n";

export default [
    // Base JS
    js.configs.recommended,

    // --- TypeScript commun (front + api) ---
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ["./front/tsconfig.json", "./api/tsconfig.json"],
                sourceType: "module",
                ecmaVersion: "latest"
            }
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "@angular-eslint": angular,
            "@angular-eslint/template": angularTemplate,
            n
        },
        rules: {
            // TS - bonnes pratiques
            "@typescript-eslint/no-unused-vars": ["error"],
            "@typescript-eslint/consistent-type-imports": ["error"],
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            "@typescript-eslint/no-explicit-any": ["warn"],
            "@typescript-eslint/explicit-function-return-type": ["warn"],
            "@typescript-eslint/no-floating-promises": ["error"],
            "@typescript-eslint/no-misused-promises": ["error"],
            "@typescript-eslint/prefer-nullish-coalescing": ["error"],
            "@typescript-eslint/prefer-optional-chain": ["error"],
            "@typescript-eslint/no-unnecessary-type-assertion": ["error"],
            "@typescript-eslint/switch-exhaustiveness-check": ["error"],

            // Angular (classes & sélecteurs)
            "@angular-eslint/component-class-suffix": ["error", { suffixes: ["Component"] }],
            "@angular-eslint/directive-class-suffix": ["error", { suffixes: ["Directive"] }],
            "@angular-eslint/component-selector": [
                "error",
                { type: "element", prefix: "app", style: "kebab-case" }
            ],
            "@angular-eslint/directive-selector": [
                "error",
                { type: "attribute", prefix: "app", style: "camelCase" }
            ],
            "@angular-eslint/no-empty-lifecycle-method": ["warn"]
        }
    },

    // --- Spécifique API (Node/Nest) : règles plugin-n seulement sur api ---
    {
        files: ["api/**/*.ts"],
        rules: {
            "n/no-missing-import": ["error"],
            "n/no-unsupported-features/es-syntax": ["error"]
        }
    },

    // --- Templates Angular (HTML) ---
    {
        files: ["front/**/*.html"],
        languageOptions: {
            // IMPORTANT: plus de "processor" ; on utilise le parser HTML d'Angular ESLint
            parser: await import("@angular-eslint/template-parser")
                .then(m => m.default ?? m)
        },
        plugins: {
            "@angular-eslint/template": angularTemplate
        },
        rules: {
            // Ajoute ici des règles de template si tu veux (exemples possibles) :
            // "@angular-eslint/template/banana-in-box": "error",
            // "@angular-eslint/template/no-negated-async": "warn"
        }
    },

    // --- Ignores globaux ---
    {
        ignores: [
            "**/dist/**",
            "**/node_modules/**",
            "**/coverage/**",
            "**/.angular/**"
        ]
    }
];
