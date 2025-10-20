import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class User {
  @ApiProperty({ type: String, example: '0000-0000-0000-0001' })
  @Expose()
  public id: string;

  @ApiProperty({ type: String, example: 'Pierre' })
  @Expose()
  public firstName: string;

  @ApiProperty({ type: String, example: 'Dupont' })
  @Expose()
  public lastName: string;

  @ApiProperty({ type: String, example: 'example@email.com' })
  @Expose()
  public email: string;

  @ApiHideProperty()
  @Exclude()
  public password: string;
}
