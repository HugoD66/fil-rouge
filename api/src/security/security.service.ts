import { Injectable } from '@nestjs/common';
import { RegisterDto } from '@fil-rouge/api/security/dto/register.dto';
import { LoginDto } from '@fil-rouge/api/security/dto/login.dto';

@Injectable()
export class SecurityService {
  public register(registerDto: RegisterDto): RegisterDto {
    return registerDto;
  }

  public login(loginDto: LoginDto): LoginDto {
    return loginDto;
  }
}
