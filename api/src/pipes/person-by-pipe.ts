import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '@fil-rouge/api/person/entities/person.entity';

@Injectable()
export class PersonByIdPipe implements PipeTransform<string, Promise<Person>> {
  constructor(@InjectRepository(Person)
    private readonly repo: Repository<Person>) {}

  async transform(id: string): Promise<Person> {
    const person = await this.repo.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Person with id ${id} not found`);
    }
    return person;
  }
}
