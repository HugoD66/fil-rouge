import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SecurityController } from '@fil-rouge/api/security/security.controller';
import { SecurityService } from '@fil-rouge/api/security/security.service';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '@fil-rouge/api/person/entities/person.entity';

const mockDataSource = {
  createQueryRunner: () => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    manager: {
      create: jest.fn().mockImplementation((cls, obj) => obj),
      save: jest.fn().mockImplementation((u) => Promise.resolve(u)),
    },
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  }),
} as unknown as DataSource;

const mockRepository = {
  findOne: jest.fn().mockResolvedValue(null),
} as any;

describe('SecurityController', () => {
  let controller: SecurityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityController],
      providers: [
        SecurityService,
        { provide: DataSource, useValue: mockDataSource },
        { provide: getRepositoryToken(Person), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<SecurityController>(SecurityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
