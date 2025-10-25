import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { Person } from '@fil-rouge/api/person/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  providers: [SecurityService],
  controllers: [SecurityController],
  exports: [SecurityService, TypeOrmModule],
})
export class SecurityModule {}
