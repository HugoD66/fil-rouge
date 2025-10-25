import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SecurityService } from '@fil-rouge/api/security/security.service';
import { DataSource } from 'typeorm';

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

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        { provide: DataSource, useValue: mockDataSource },
        { provide: 'PersonRepository', useValue: mockRepository },
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
