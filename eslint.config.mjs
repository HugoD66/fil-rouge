import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import n from "eslint-plugin-n";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Résout les tsconfig de façon absolue afin que ESLint fonctionne
// que l'on lance depuis la racine du repo ou depuis un workspace.
const candidateTsconfigs = [
    path.join(__dirname, "tsconfig.json"),
    path.join(__dirname, "front", "tsconfig.json"),
    path.join(__dirname, "api", "tsconfig.json")
];
const tsconfigProjects = candidateTsconfigs.filter(p => fs.existsSync(p));

export default [
    // Base JS
    js.configs.recommended,

    // Override pour tous les fichiers TypeScript du monorepo
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                // chemins absolus vers les tsconfig présents
                project: tsconfigProjects,
                // utile pour @typescript-eslint
                tsconfigRootDir: __dirname,
                sourceType: "module",
                ecmaVersion: "latest"
            },
            globals: {
                // globals bannière pour prévenir les erreurs `no-undef` côté front
                console: "readonly",
                window: "readonly",
                document: "readonly",
                navigator: "readonly",
                // timers (navigateur et node)
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly"
            }
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "@angular-eslint": angular,
            "@angular-eslint/template": angularTemplate,
            n
        },
        rules: {
            // Désactiver la règle JS de base et laisser la version TS la prendre en charge
            "no-unused-vars": "off",

            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
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

    // Règles spécifiques aux fichiers API (Node/Nest)
    {
        files: ["api/**/*.ts"],
        rules: {
            "n/no-missing-import": ["error"],
            "n/no-unsupported-features/es-syntax": ["error"]
        }
    },

    // Templates Angular (HTML)
    {
        files: ["front/**/*.html"],
        languageOptions: {
            parser: await import("@angular-eslint/template-parser").then(m => m.default ?? m)
        },
        plugins: {
            "@angular-eslint/template": angularTemplate
        },
        rules: {
            // règles de template si nécessaire
        }
    },

    // Fichiers de tests unitaires (Jest) — déclare les symboles fournis par Jest
    {
        files: ["**/*.spec.ts", "**/__tests__/**"],
        languageOptions: {
            globals: {
                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                jest: "readonly"
            }
        }
    },

    // Fichiers serveur (Node) — déclare `process`, `__dirname`, etc.
    {
        files: ["**/*server.ts", "server.ts"],
        languageOptions: {
            globals: {
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
                console: "readonly"
            }
        }
    },

    // Ignorer les dossiers de build/dep
    {
        ignores: [
            "**/dist/**",
            "**/node_modules/**",
            "**/coverage/**",
            "**/.angular/**"
        ]
    }
];
