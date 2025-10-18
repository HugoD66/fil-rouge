import { Controller, Get } from '@nestjs/common';
import { AppService } from '@fil-rouge/api/app.service';
import { User } from '@fil-rouge/api/user/entities/user.entity';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ type: User })
  getHello(): User {
    return this.appService.getHello();
  }
}
