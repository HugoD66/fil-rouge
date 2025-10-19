import { Injectable } from '@nestjs/common';
import { User } from '@fil-rouge/api/user/entities/user.entity';

@Injectable()
export class AppService {
  getHello(): User {
    return {
      firstName: 'Test',
      lastName: 'Generation',
    };
  }
}
