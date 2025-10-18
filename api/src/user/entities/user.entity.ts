import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;
}
