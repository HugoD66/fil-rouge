import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { PersonService } from '@fil-rouge/api/person/person.service';
import { UpdatePersonDto } from '@fil-rouge/api/person/dto/update-person.dto';
import { Person } from '@fil-rouge/api/person/entities/person.entity';

@Controller('person')
@UseInterceptors(ClassSerializerInterceptor)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  public async findAll(): Promise<Person[]> {
    return this.personService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Person> {
    return this.personService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
      skipMissingProperties: true,
    }),
  )
  public async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
    try {
      return await this.personService.update(id, updatePersonDto);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async remove(id: string): Promise<void> {
    await this.personService.remove(id);
  }
}
