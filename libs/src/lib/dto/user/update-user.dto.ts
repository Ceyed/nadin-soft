import { PartialType, PickType } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities';

export class UpdateUserDto extends PartialType(
  PickType(UserEntity, ['email', 'mobile', 'password'] as const),
) {}
