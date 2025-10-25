import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';

import { Person } from '@fil-rouge/api/person/entities/person.entity';
import { PersonService } from '@fil-rouge/api/person/person.service';
import { PersonController } from '@fil-rouge/api/person/person.controller';

/* ------------------------------ ENV (Postgres) ----------------------------- */
// Chemin corrigé : test/.env.test
dotenv.config({ path: 'test/.env.test' });

/* ----------------------------- Utils & factories ---------------------------- */

const makePerson = (overrides: Partial<Person> = {}): Person =>
  ({
    id: overrides.id ?? randomUUID(),
    firstName: overrides.firstName ?? 'John',
    lastName: overrides.lastName ?? 'Doe',
    email:
      overrides.email ??
      `john.doe.${Math.random().toString(36).slice(2)}@example.com`,
    password: overrides.password ?? 'S3cretP4ss!',
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  }) as Person;

/* ---------------------------------- Tests ---------------------------------- */

describe(`${PersonController.name} (e2e)`, () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let repo: Repository<Person>;

  const existingId = randomUUID();
  const anotherId = randomUUID();
  const unknownId = randomUUID();

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        // Connexion Postgres (base filrouge_test)
        TypeOrmModule.forRoot({
          type: 'postgres',
          url:
            process.env.DATABASE_URL ??
            `postgres://${encodeURIComponent(String(process.env.POSTGRES_USER ?? ''))}:${encodeURIComponent(
              String(process.env.POSTGRES_PASSWORD ?? ''),
            )}@${String(process.env.POSTGRES_HOST ?? 'localhost')}:${Number(
              process.env.POSTGRES_PORT ?? '5432',
            )}/${String(process.env.POSTGRES_DB ?? '')}`,
          entities: [Person],
          synchronize: true, // OK en E2E
          dropSchema: true,  // base propre à chaque run
          logging: false,
          retryAttempts: 1,
        }),
        TypeOrmModule.forFeature([Person]),
      ],
      controllers: [PersonController],
      providers: [PersonService],
    }).compile();

    app = moduleRef.createNestApplication();

    // même config globale que main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidUnknownValues: false,
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.init();

    repo = moduleRef.get<Repository<Person>>(getRepositoryToken(Person));

    // Seed
    await repo.save([
      makePerson({
        id: existingId,
        firstName: 'Pierre',
        lastName: 'Dupont',
        email: 'p.dupont@example.com',
      }),
      makePerson({
        id: anotherId,
        firstName: 'Anne',
        lastName: 'Martin',
        email: 'a.martin@example.com',
      }),
    ]);
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
  });

  /* --------------------------------- GET all -------------------------------- */

  describe(`GET /person`, () => {
    it('Should return a list of persons (200) without password', async () => {
      const res: Response = await request(app.getHttpServer())
        .get('/person')
        .expect(HttpStatus.OK);

      const body: unknown = res.body;
      expect(Array.isArray(body)).toBe(true);

      if (Array.isArray(body)) {
        expect(body.length).toBeGreaterThanOrEqual(2);
        for (const p of body) {
          const rec = p as Record<string, unknown>;
          expect(Object.prototype.hasOwnProperty.call(rec, 'password')).toBe(
            false,
          );
        }
      }
    });
  });

  /* -------------------------------- GET by id ------------------------------- */

  describe(`GET /person/:id`, () => {
    it('Should return one person by id (200) without password', async () => {
      const res = await request(app.getHttpServer())
        .get(`/person/${existingId}`)
        .expect(HttpStatus.OK);

      expect(res.body).toMatchObject({
        id: existingId,
        firstName: 'Pierre',
        lastName: 'Dupont',
        email: 'p.dupont@example.com',
      });
      expect(Object.prototype.hasOwnProperty.call(res.body, 'password')).toBe(
        false,
      );
    });

    it('Should return 404 when person does not exist', async () => {
      await request(app.getHttpServer())
        .get(`/person/${unknownId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  /* ---------------------------------- PATCH --------------------------------- */

  describe(`PATCH /person/:id`, () => {
    it('Should partially update and return the person (200)', async () => {
      const dtoUpdate = {
        firstName: 'Pierre-Emmanuel',
        email: 'p.dupont.updated@example.com',
      };

      const res = await request(app.getHttpServer())
        .patch(`/person/${existingId}`)
        .send(dtoUpdate)
        .expect(HttpStatus.OK);

      expect(res.body).toMatchObject({
        id: existingId,
        firstName: 'Pierre-Emmanuel',
        lastName: 'Dupont',
        email: 'p.dupont.updated@example.com',
      });
      expect(Object.prototype.hasOwnProperty.call(res.body, 'password')).toBe(
        false,
      );
    });

    it('Should return 404 when person does not exist', async () => {
      const dtoUpdate = { firstName: 'Nobody' };
      await request(app.getHttpServer())
        .patch(`/person/${unknownId}`)
        .send(dtoUpdate)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should return 500 on unique email collision', async () => {
      // mettre l’email de Anne sur Pierre
      const dtoUpdate = { email: 'a.martin@example.com' };
      await request(app.getHttpServer())
        .patch(`/person/${existingId}`)
        .send(dtoUpdate)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  /* ---------------------------------- DELETE -------------------------------- */

  describe(`DELETE /person/:id`, () => {
    it('Should delete the person (200) then GET returns 404', async () => {
      await request(app.getHttpServer())
        .delete(`/person/${anotherId}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/person/${anotherId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should return 404 when person does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`/person/${unknownId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
