import { Controller, Get } from '@nestjs/common';
import { AppService } from '@fil-rouge/api/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
