import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdatePersonDto {
  /*@IsUUID('4')
  @IsNotEmpty()
  @IsString()
  public id!: string;*/

  @ApiProperty({
    minLength: 2,
    maxLength: 50,
    example: 'Pierre',
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  public firstName?: string;

  @ApiProperty({ minLength: 2, maxLength: 50, example: 'Dupont' })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  public lastName?: string;

  @ApiProperty({ minLength: 2, maxLength: 50, example: 'example@email.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  public email?: string;

  @ApiProperty({ type: Date, example: '2024-01-01T12:00:00Z' })
  @IsNotEmpty()
  public updatedAt!: Date;
}
