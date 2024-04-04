import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/iam/iam.constant';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { UserRoleEnum } from 'src/users/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = await this._reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!contextRoles) {
      return true;
    }

    const activeUser: ActiveUserData = context.switchToHttp().getRequest()[REQUEST_USER_KEY];
    return contextRoles.some((role) => activeUser.role === role);
  }
}
