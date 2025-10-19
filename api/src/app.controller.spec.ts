import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@fil-rouge/api/app.controller';
import { AppService } from '@fil-rouge/api/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(appController.getHello()).toBe('Hello World!');
      //Sortie attendue : const user: User = {
      //       firstName: 'Test',
      //       lastName: 'Generation',
      //     };

      expect(appController.getHello()).toEqual({
        firstName: 'Test',
        lastName: 'Generation',
      });
    });
  });
});
