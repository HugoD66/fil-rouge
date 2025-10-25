import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';

function loadEnv(): void {
  const isProd = process.env.NODE_ENV === 'production';

  const candidates = isProd
    ? [
      path.resolve(process.cwd(), 'api/.env.prod'),
      path.resolve(process.cwd(), 'api/.env'),
    ]
    : [
      path.resolve(process.cwd(), 'api/.env'),
      path.resolve(process.cwd(), 'api/.env.local'),
    ];

  let loaded = false;
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      loaded = true;
      break;
    }
  }

  if (!loaded) {
    const fallback = isProd
      ? [
        path.resolve(process.cwd(), '.env.prod'),
        path.resolve(process.cwd(), '.env'),
      ]
      : [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '.env.local'),
      ];
    for (const p of fallback) {
      if (fs.existsSync(p)) {
        dotenv.config({ path: p });
        break;
      }
    }
  }
}
loadEnv();

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().allow('', null),
  DOMAIN: Joi.string().allow('', null),
  POSTGRES_HOST: Joi.string().default('localhost'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_SSL: Joi.boolean().default(false),
  DATABASE_URL: Joi.string().uri().optional(),
})
  .unknown(true)
  .prefs({ abortEarly: false });

type EnvDict = Record<string, string | number | boolean | null | undefined>;
 
const { value, error } = envSchema.validate(process.env);

if (error) {
  console.error(
    '❌ Validation .env échouée :',
    error.details.map((d) => d.message).join(', '),
  );
  process.exit(1);
}

const env = value as EnvDict;

Object.keys(env).forEach((k) => {
  const v = env[k];
  if (v !== undefined && v !== null) process.env[k] = String(v);
});

const useUrl = !!process.env.DATABASE_URL;

export default new DataSource({
  type: 'postgres',
  ...(useUrl
    ? {
      url: process.env.DATABASE_URL,
    }
    : {
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    }),
  ssl:
    process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/db/migrations/*.ts'],

  // logging: true,
});
