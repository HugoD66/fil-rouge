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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var person_module_1 = require("@fil-rouge/api/person/person.module");
var security_module_1 = require("./security/security.module");
var joi_1 = require("joi");
var typeorm_1 = require("@nestjs/typeorm");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: process.env.NODE_ENV === 'production'
                        ? ['.env.prod', '.env']
                        : ['.env', '.env.local'],
                    validationSchema: joi_1.default.object({
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
                    }),
                }),
                typeorm_1.TypeOrmModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (cfg) {
                        var url = cfg.get('DATABASE_URL');
                        var ssl = cfg.get('POSTGRES_SSL');
                        return __assign(__assign({ type: 'postgres' }, (url
                            ? { url: url }
                            : {
                                host: cfg.get('POSTGRES_HOST'),
                                port: cfg.get('POSTGRES_PORT'),
                                username: cfg.get('POSTGRES_USER'),
                                password: cfg.get('POSTGRES_PASSWORD'),
                                database: cfg.get('POSTGRES_DB'),
                            })), { synchronize: false, autoLoadEntities: true, ssl: ssl ? { rejectUnauthorized: false } : false });
                    },
                }),
                person_module_1.PersonModule,
                security_module_1.SecurityModule,
            ],
            controllers: [],
            providers: [],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
