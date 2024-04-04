import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Role = (...roles: UserRoleEnum[]) => SetMetadata(ROLES_KEY, roles);
