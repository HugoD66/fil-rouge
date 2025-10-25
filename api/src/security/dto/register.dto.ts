import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 50,
    example: 'Pierre',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName!: string;

  @ApiProperty({ minLength: 2, maxLength: 50, example: 'Dupont' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName!: string;

  @ApiProperty({ minLength: 2, maxLength: 50, example: 'example@email.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ minLength: 2, maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  public password!: string;
}
