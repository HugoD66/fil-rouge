import { Injectable, ConflictException } from '@nestjs/common';
import { RegisterDto } from '@fil-rouge/api/security/dto/register.dto';
import { LoginDto } from '@fil-rouge/api/security/dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Person } from '@fil-rouge/api/person/entities/person.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityService {
  public constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Person)
    private readonly userRepository: Repository<Person>,
  ) {}

  public async register(registerDto: RegisterDto): Promise<Person> {
    const { email, password, firstName, lastName } = registerDto;

    const existing: Person | null = await this.userRepository.findOne({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const passwordHash = await bcrypt.hash(password, 12);

      const user: Person = queryRunner.manager.create(Person, {
        email,
        firstName,
        lastName,
        password: passwordHash,
      });

      const saved: Person = await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      throw new Error('Registration failed' +
          (error instanceof Error ? `: ${error.message}` : ''));
    } finally {
      await queryRunner.release();
    }
  }

  public login(loginDto: LoginDto): LoginDto {
    return loginDto;
  }
}
