import { Module } from '@nestjs/common';
import { SecurityService } from '@fil-rouge/api/security/security.service';
import { SecurityController } from '@fil-rouge/api/security/security.controller';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
})
export class SecurityModule {}
