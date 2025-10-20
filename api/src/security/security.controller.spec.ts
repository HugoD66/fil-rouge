import { Test, TestingModule } from '@nestjs/testing';
import { SecurityController } from '@fil-rouge/api/security/security.controller';
import { SecurityService } from '@fil-rouge/api/security/security.service';

describe('SecurityController', () => {
  let controller: SecurityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityController],
      providers: [SecurityService],
    }).compile();

    controller = module.get<SecurityController>(SecurityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
