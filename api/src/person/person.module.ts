import { Module } from '@nestjs/common';
import { PersonService } from '@fil-rouge/api/person/person.service';
import { PersonController } from '@fil-rouge/api/person/person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '@fil-rouge/api/person/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PersonController],
  providers: [TypeOrmModule, PersonService],
  exports: [PersonService],
})
export class PersonModule {}
