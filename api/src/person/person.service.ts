import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {UpdatePersonDto} from '@fil-rouge/api/person/dto/update-person.dto';
import {DeleteResult, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Person} from '@fil-rouge/api/person/entities/person.entity';

@Injectable()
export class PersonService {
  public constructor(@InjectRepository(Person)
                     private readonly userRepository: Repository<Person>) {}

  public async findAll(): Promise<Person[]> {
    return await this.userRepository.find();
  }

  /* public async findOne(id: string): Promise<Person> {
    try {
      const person: Person | null = await this.userRepository.findOne({
        where: { id },
      });

      if (!person) {
        throw new NotFoundException(`Person with id ${id} not found`);
      }

      return person;
    } catch (error) {
      console.error('Error fetching person:', error);
      throw error;
    }
  }*/

  public async update(
    updatePersonDto: UpdatePersonDto,
    person: Person,
  ): Promise<Person> {
    try {
      const updatedPerson: Person & UpdatePersonDto = Object.assign(
        person,
        updatePersonDto,
      );

      return await this.userRepository.save(updatedPerson);
    } catch (error) {
      console.error('Error updating person:', error);
      throw new InternalServerErrorException('Error updating person');
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const result: DeleteResult = await this.userRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Person with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error deleting person:', error);
      throw new InternalServerErrorException('Error deleting person');
    }
  }
}
