import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '@fil-rouge/api/user/dto/update-user.dto';
import { UserDto } from '@fil-rouge/api/user/dto/user.dto';

@Injectable()
export class UserService {
  public findAll(): UserDto[] {
    const userOne = {
      id: '0000-0000-0000-0001',
      firstName: 'Pierre',
      lastName: 'Michael',
      email: 'example@email.com',
    };
    const userTwo = {
      id: '0000-0000-0000-0002',
      firstName: 'Pierro',
      lastName: 'Michaell',
      email: 'example2@email.com',
    };

    return [userOne, userTwo];
  }

  public findOne(id: number): UserDto {
    console.log(id);
    const userOne = {
      id: '0000-0000-0000-0001',
      firstName: 'Pierre',
      lastName: 'Michael',
      email: 'example@email.com',
    };
    return userOne;
  }

  public update(id: number, updateUserDto: UpdateUserDto): UpdateUserDto {
    console.log('id:', id);
    return updateUserDto;
  }

  public remove(id: number): void {
    console.log('id:', id);
    return;
  }
}
