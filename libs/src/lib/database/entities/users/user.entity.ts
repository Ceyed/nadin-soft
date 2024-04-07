import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { uuid } from 'libs/src/lib/constants';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserRoleEnum } from '../../../enums';
import { BaseEntity } from '../base.entity';
import { FileEntity } from '../files';
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
  @IsPhoneNumber(undefined, {
    message: 'Phone number should be in this format: +989XXXXXXXXX',
  })
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
  @ApiProperty({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.BaseUser,
  })
  role: UserRoleEnum;

  @OneToMany(() => TaskEntity, (task) => task.user, { nullable: true })
  tasks: TaskEntity[];

  @Column({ nullable: true })
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  avatarId?: uuid;

  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'avatarId' })
  avatar?: FileEntity;
}
