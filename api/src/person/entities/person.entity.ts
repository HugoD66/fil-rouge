import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Person {
  @ApiProperty({ type: String, example: '0000-0000-0000-0001' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  public id: string;

  @ApiProperty({ type: String, example: 'Pierre' })
  @Expose()
  @Column()
  public firstName: string;

  @ApiProperty({ type: String, example: 'Dupont' })
  @Expose()
  @Column()
  public lastName: string;

  @ApiProperty({ type: String, example: 'example@email.com' })
  @Column({ unique: true })
  @Expose()
  public email: string;

  @ApiHideProperty()
  @Exclude()
  @Column()
  public password: string;

  @ApiProperty({ type: Date, example: '2024-01-01T12:00:00Z' })
  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2024-01-01T12:00:00Z' })
  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;
}
