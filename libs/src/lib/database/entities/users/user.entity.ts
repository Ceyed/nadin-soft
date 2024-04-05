import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserRoleEnum } from '../../../enums';
import { BaseEntity } from '../base.entity';
import { IsEmail } from 'class-validator';
import { TaskEntity } from '../tasks';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  @ApiProperty()
  @IsEmail()
  email: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.BaseUser })
  @ApiProperty({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.BaseUser })
  role: UserRoleEnum;

  @OneToMany(() => TaskEntity, (task) => task.user, { nullable: true })
  tasks: TaskEntity[];
}
