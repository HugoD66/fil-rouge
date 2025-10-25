/// <reference types="jest" />
/* eslint-env jest */

import * as path from 'path';
import * as dotenv from 'dotenv';
import type {
  INestApplication} from '@nestjs/common';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';

import { Person } from '../src/person/entities/person.entity';
import { PersonService } from '../src/person/person.service';
import { PersonController } from '../src/person/person.controller';

dotenv.config({ path: path.resolve(__dirname, '.env.test') });

// Quick debug log for e2e env (avoid printing sensitive values)
const e2eHost = process.env.POSTGRES_HOST;
const e2ePort = process.env.POSTGRES_PORT;
const e2eUser = process.env.POSTGRES_USER;
const e2eDb = process.env.POSTGRES_DB;
console.info('[e2e setup] PG host=%s port=%s user=%s db=%s', e2eHost, e2ePort, e2eUser, e2eDb);

jest.setTimeout(30000);

declare global {
   
  var __APP__: INestApplication | undefined;
   
  var __MODULE__: TestingModule | undefined;
   
  var __DS__: DataSource | undefined;
   
  var __E2E_BOOTSTRAPPED__: boolean | undefined;
}

async function bootstrapE2EApp() {
  if (global.__E2E_BOOTSTRAPPED__) return; // déjà prêt

  const moduleRef = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.POSTGRES_HOST!,
        port: Number(process.env.POSTGRES_PORT ?? '5432'),
        username: process.env.POSTGRES_USER!,
        password: String(process.env.POSTGRES_PASSWORD ?? ''),
        database: process.env.POSTGRES_DB!,
        entities: [Person],
        synchronize: true,
        dropSchema: true,
        logging: false,
      }),
      TypeOrmModule.forFeature([Person]),
    ],
    controllers: [PersonController],
    providers: [PersonService],
  }).compile();

  const app = moduleRef.createNestApplication();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidUnknownValues: false,
    skipMissingProperties: true,
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.init();

  const ds = moduleRef.get<DataSource>(getDataSourceToken());

  global.__APP__ = app;
  global.__MODULE__ = moduleRef;
  global.__DS__ = ds;
  global.__E2E_BOOTSTRAPPED__ = true;

  const cleanup = async () => {
    try { await global.__APP__?.close(); } catch { /* ignore */ }
    try { await global.__MODULE__?.close(); } catch { /* ignore */ }
    try { await global.__DS__?.destroy(); } catch { /* ignore */ }

    global.__APP__ = undefined;
    global.__MODULE__ = undefined;
    global.__DS__ = undefined;
    global.__E2E_BOOTSTRAPPED__ = false;
  };

  process.once('exit', () => { void cleanup(); });
  process.once('SIGINT', () => { void cleanup().finally(() => process.exit(130)); });
  process.once('SIGTERM', () => { void cleanup().finally(() => process.exit(143)); });

  (global as any).__E2E_CLEANUP__ = cleanup;
}

beforeAll(async () => {
  await bootstrapE2EApp();
});

// Ensure Jest can exit cleanly by closing any open resources
afterAll(async () => {
  const cleanup = (global as any).__E2E_CLEANUP__ as (() => Promise<void>) | undefined;
  if (cleanup) {
    await cleanup();
    console.info('[e2e teardown] cleaned up global resources');
  }
});

// Helper optionnel dispo dans les specs
export async function resetDatabase() {
  if (!global.__DS__) throw new Error('DataSource not ready');
  // Drop + recreate (OK en E2E)
  await global.__DS__.synchronize(true);
}
