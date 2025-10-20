import { Module } from '@nestjs/common';
import { UserService } from '@fil-rouge/api/user/user.service';
import { UserController } from '@fil-rouge/api/user/user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
