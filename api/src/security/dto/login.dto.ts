import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ minLength: 2, maxLength: 50, example: 'example@email.com' })
  @IsString()
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ minLength: 2, maxLength: 50 })
  @IsString()
  @Exclude()
  @IsNotEmpty()
  @Length(2, 50)
  public password!: string;
}
