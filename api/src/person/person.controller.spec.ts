import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from '@fil-rouge/api/person/person.controller';
import { PersonService } from '@fil-rouge/api/person/person.service';

describe('PersonController', () => {
  let controller: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [PersonService],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
