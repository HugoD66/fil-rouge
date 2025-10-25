import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PersonController } from '@fil-rouge/api/person/person.controller';
import { PersonService } from '@fil-rouge/api/person/person.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '@fil-rouge/api/person/entities/person.entity';

const mockRepository = {
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockImplementation((u) => Promise.resolve(u)),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
} as any;

const mockPersonService = {
  findAll: jest.fn().mockResolvedValue([]),
};

describe('PersonController', () => {
  let controller: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        { provide: PersonService, useValue: mockPersonService },
        { provide: getRepositoryToken(Person), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
