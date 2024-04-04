import { Column, Entity } from 'typeorm';
import { UserRoleEnum } from '../../../enums';
import { BaseEntity } from '../base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.BaseUser })
  role: UserRoleEnum;
}
