import { OmitType } from '@nestjs/swagger';
import { GLOBAL_EXCEPT_DTO } from '../../constants';
import { UserEntity } from '../../database/entities';

export class SignUpDto extends OmitType(UserEntity, [
  ...GLOBAL_EXCEPT_DTO,
  'role',
  'tasks',
  'avatar',
  'avatarId',
] as const) {}
