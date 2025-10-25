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

const candidateTsconfigs = [
    path.join(__dirname, "tsconfig.json"),
    path.join(__dirname, "front", "tsconfig.json"),
    path.join(__dirname, "api", "tsconfig.json"),
    path.join(__dirname, "api", "tsconfig.spec.json"),
    path.join(__dirname, "api", "test", "tsconfig.e2e.json"),
];
const tsconfigProjects = candidateTsconfigs.filter(p => fs.existsSync(p));

export default [
    js.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: tsconfigProjects,
                tsconfigRootDir: __dirname,
                sourceType: "module",
                ecmaVersion: "latest"
            },
            globals: {
                console: "readonly",
                window: "readonly",
                document: "readonly",
                navigator: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                // Node globals commonly used in backend and scripts
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
                global: 'readonly'
            }
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "@angular-eslint": angular,
            "@angular-eslint/template": angularTemplate,
            n
        },
        rules: {
            "no-unused-vars": "off",
            "indent": ["error", 2],
            // Forcer les retours à la ligne des paramètres quand la signature est multi‑ligne
            "function-paren-newline": ["error", "multiline"],
            "function-call-argument-newline": ["error", "consistent"],
            "comma-dangle": ["error", "always-multiline"],
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
    {
        files: ["api/**/*.ts"],
        rules: {
            "n/no-missing-import": ["error"],
            "n/no-unsupported-features/es-syntax": ["error"]
        }
    },
    {
        files: ["front/**/*.html"],
        languageOptions: {
            parser: await import("@angular-eslint/template-parser").then(m => m.default ?? m)
        },
        plugins: {
            "@angular-eslint/template": angularTemplate
        },
    },
    {
        files: ["**/*.spec.ts", "**/*.e2e-spec.ts", "**/__tests__/**", "test/**", "**/test/**"],
        languageOptions: {
            globals: {
                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                jest: "readonly"
            }
        }
    },
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
    {
        files: ["**/*.js", "**/*.cjs", "tools/**", "*.cjs"],
        languageOptions: {
            // Node globals used in JS scripts/configs
            globals: {
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                console: 'readonly',
                global: 'readonly'
            }
        },
    },
    {
        files: ["front/**/*.ts", "front/**/*.tsx", "front/**/*.html"],
        languageOptions: {
            globals: {
                fetch: 'readonly'
            }
        }
    },
    {
        ignores: [
            "node_modules/",
            "dist/",
            "**/dist/**",
            "coverage/",
            "**/coverage/**",
            "api/dist/",
            "front/dist/",
            "api/src/**/*.js",
            "front/src/**/*.js",
            "src/**/*.js",
            "tools/",
            "eslint-report.log",
            ".env",
            "**/.env*",
            "**/.angular/**",
            ".vscode/",
            ".idea/"
        ]
    }
];
