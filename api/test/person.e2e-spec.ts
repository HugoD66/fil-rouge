/// <reference types="jest" />
/* eslint-env jest */
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Person } from '@fil-rouge/api/person/entities/person.entity';

const _makePerson = (overrides: Partial<Person> = {}): Person =>
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

describe('PersonController (e2e)', () => {
  const existingId = 'a45e0835-abf8-495c-8a12-f0c80b08e42b';
  const anotherId  = 'dcd2788a-dd69-4e12-a1a0-500e1b704a40';
  const unknownId  = randomUUID();

  let repo: Repository<Person>;

  beforeAll(async () => {
    const ds = (global as any).__DS__;
    repo = ds.getRepository(Person);

    await repo.save([
      { id: existingId, firstName: 'Pierre', lastName: 'Dupont', email: 'p.dupont@example.com', password: 'S3cretP4ss!' } as Person,
      { id: anotherId,  firstName: 'Anne',   lastName: 'Martin', email: 'a.martin@example.com',  password: 'S3cretP4ss!' } as Person,
    ]);
  });

  describe('GET /person', () => {
    it('Should return a list without password', async () => {
      const app = (global as any).__APP__;
      const res = await request(app.getHttpServer())
        .get('/person')
        .expect(HttpStatus.OK);

      expect(Array.isArray(res.body)).toBe(true);
      for (const p of res.body) {
        expect(Object.prototype.hasOwnProperty.call(p, 'password')).toBe(false);
      }
    });
  });

  describe('GET /person/:id', () => {
    it('Should return one person', async () => {
      const app = (global as any).__APP__;
      const res = await request(app.getHttpServer())
        .get(`/person/${existingId}`)
        .expect(HttpStatus.OK);

      expect(res.body).toMatchObject({
        id: existingId,
        firstName: 'Pierre',
        lastName: 'Dupont',
        email: 'p.dupont@example.com',
      });
      expect(Object.prototype.hasOwnProperty.call(res.body, 'password')).toBe(false);
    });

    it('Should return 404 when not found', async () => {
      const app = (global as any).__APP__;
      await request(app.getHttpServer())
        .get(`/person/${unknownId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /person/:id', () => {
    it('Should partially update and return 200', async () => {
      const app = (global as any).__APP__;
      const dtoUpdate = { firstName: 'Pierre-Emmanuel', email: 'p.dupont.updated@example.com' };

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
      expect(Object.prototype.hasOwnProperty.call(res.body, 'password')).toBe(false);
    });

    it('Should return 404 when not found', async () => {
      const app = (global as any).__APP__;
      const dtoUpdate = { firstName: 'Nobody' };

      await request(app.getHttpServer())
        .patch(`/person/${unknownId}`)
        .send(dtoUpdate)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should return 500 on unique email collision', async () => {
      const app = (global as any).__APP__;
      const dtoUpdate = { email: 'a.martin@example.com' };

      await request(app.getHttpServer())
        .patch(`/person/${existingId}`)
        .send(dtoUpdate)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /person/:id', () => {
    it('Should delete and then 404', async () => {
      const app = (global as any).__APP__;
      await request(app.getHttpServer())
        .delete(`/person/${anotherId}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/person/${anotherId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should return 404 when not found', async () => {
      const app = (global as any).__APP__;
      await request(app.getHttpServer())
        .delete(`/person/${unknownId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
