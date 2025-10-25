import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PersonService } from '@fil-rouge/api/person/person.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from '@fil-rouge/api/person/entities/person.entity';


const mockRepository = {
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockImplementation((u) => Promise.resolve(u)),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
} as any;

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        { provide: getRepositoryToken(Person), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
