import { Controller, Post, Body } from '@nestjs/common';
import { SecurityService } from './security.service';
import { RegisterDto } from '@fil-rouge/api/security/dto/register.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoginDto } from '@fil-rouge/api/security/dto/login.dto';
import { Person } from '@fil-rouge/api/person/entities/person.entity';

@Controller('security')
export class SecurityController {
  public constructor(private readonly securityService: SecurityService) {}

  @Post('register')
  @ApiOkResponse()
  public register(@Body() registerDto: RegisterDto): Promise<Person> {
    return this.securityService.register(registerDto);
  }

  @Post('login')
  @ApiOkResponse()
  public login(@Body() loginDto: LoginDto): LoginDto {
    // Todo change return ( AuthResult ? )
    return this.securityService.login(loginDto);
  }

  //Logout
}
