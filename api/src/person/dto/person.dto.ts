import { ApiProperty } from '@nestjs/swagger';

export class PersonDto {
  @ApiProperty({ example: '0000-0000-0000-0001' })
  public id!: string;

  @ApiProperty({ example: 'Pierre' })
  public firstName!: string;

  @ApiProperty({ example: 'Dupont' })
  public lastName!: string;

  @ApiProperty({ example: 'example@email.com' })
  public email!: string;
}
