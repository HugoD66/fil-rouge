import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from '@fil-rouge/api/user/user.service';
import { UpdateUserDto } from '@fil-rouge/api/user/dto/update-user.dto';
import { UserDto } from '@fil-rouge/api/user/dto/user.dto';

@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get()
  public findAll(): UserDto[] {
    return this.userService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): UserDto {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): UpdateUserDto {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string): void {
    return this.userService.remove(+id);
  }
}
