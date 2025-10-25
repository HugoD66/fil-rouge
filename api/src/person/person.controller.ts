import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseInterceptors,
  InternalServerErrorException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PersonService } from '@fil-rouge/api/person/person.service';
import { UpdatePersonDto } from '@fil-rouge/api/person/dto/update-person.dto';
import { Person } from '@fil-rouge/api/person/entities/person.entity';
import { PersonByIdPipe } from '@fil-rouge/api/pipes/person-by-pipe';

@Controller('person')
@UseInterceptors(ClassSerializerInterceptor)
export class PersonController {
  constructor(
    private readonly personService: PersonService,
  ) {}

  @Get()
  public async findAll(): Promise<Person[]> {
    return this.personService.findAll();
  }

  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe, PersonByIdPipe) person: Person): Promise<Person> {
    return person;
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe, PersonByIdPipe) person: Person,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
    try {
      return await this.personService.update(updatePersonDto, person);
    } catch (_err) {
      throw new InternalServerErrorException('Error update');
    }
  }


  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async remove(
    @Param('id', ParseUUIDPipe, PersonByIdPipe) person: Person,
  ): Promise<void> {
    await this.personService.remove(person.id);
  }
}
