import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities';

export class SignUpDto extends PickType(UserEntity, ['email', 'password'] as const) {}
