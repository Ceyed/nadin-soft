import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../../database/entities';
import { PickType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(PickType(UserEntity, [] as const)) {}
