import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { UserRoleEnum } from '../../../enums';
import { BaseEntity } from '../base.entity';
import { TaskEntity } from '../tasks';

@Entity({ name: 'user' })
@Index(['email', 'mobile', 'username'])
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  @ApiProperty()
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  mobile: string;

  @Column({ unique: true })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column()
  @ApiProperty()
  @MinLength(8)
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.BaseUser })
  @ApiProperty({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.BaseUser })
  role: UserRoleEnum;

  @OneToMany(() => TaskEntity, (task) => task.user, { nullable: true })
  tasks: TaskEntity[];
}
