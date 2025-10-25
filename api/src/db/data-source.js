"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// api/src/db/data-source.ts
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var path = require("path");
var fs = require("fs");
var dotenv = require("dotenv");
var joi_1 = require("joi");
function loadEnv() {
    var isProd = process.env.NODE_ENV === 'production';
    var candidates = isProd
        ? [
            path.resolve(process.cwd(), 'api/.env.prod'),
            path.resolve(process.cwd(), 'api/.env'),
        ]
        : [
            path.resolve(process.cwd(), 'api/.env'),
            path.resolve(process.cwd(), 'api/.env.local'),
        ];
    var loaded = false;
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var p = candidates_1[_i];
        if (fs.existsSync(p)) {
            dotenv.config({ path: p });
            loaded = true;
            break;
        }
    }
    if (!loaded) {
        var fallback = isProd
            ? [
                path.resolve(process.cwd(), '.env.prod'),
                path.resolve(process.cwd(), '.env'),
            ]
            : [
                path.resolve(process.cwd(), '.env'),
                path.resolve(process.cwd(), '.env.local'),
            ];
        for (var _a = 0, fallback_1 = fallback; _a < fallback_1.length; _a++) {
            var p = fallback_1[_a];
            if (fs.existsSync(p)) {
                dotenv.config({ path: p });
                break;
            }
        }
    }
}
loadEnv();
var envSchema = joi_1.default.object({
    PORT: joi_1.default.number().default(3000),
    CORS_ORIGIN: joi_1.default.string().allow('', null),
    DOMAIN: joi_1.default.string().allow('', null),
    POSTGRES_HOST: joi_1.default.string().default('localhost'),
    POSTGRES_PORT: joi_1.default.number().default(5432),
    POSTGRES_USER: joi_1.default.string().required(),
    POSTGRES_PASSWORD: joi_1.default.string().required(),
    POSTGRES_DB: joi_1.default.string().required(),
    POSTGRES_SSL: joi_1.default.boolean().default(false),
    DATABASE_URL: joi_1.default.string().uri().optional(),
})
    .unknown(true)
    .prefs({ abortEarly: false });
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
var _a = envSchema.validate(process.env), value = _a.value, error = _a.error;
if (error) {
    console.error('❌ Validation .env échouée :', error.details.map(function (d) { return d.message; }).join(', '));
    process.exit(1);
}
var env = value;
Object.keys(env).forEach(function (k) {
    var v = env[k];
    if (v !== undefined && v !== null)
        process.env[k] = String(v);
});
var useUrl = !!process.env.DATABASE_URL;
exports.default = new typeorm_1.DataSource(__assign(__assign({ type: 'postgres' }, (useUrl
    ? {
        url: process.env.DATABASE_URL,
    }
    : {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    })), { ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false, entities: ['src/**/*.entity.ts'], migrations: ['src/db/migrations/*.ts'] }));
