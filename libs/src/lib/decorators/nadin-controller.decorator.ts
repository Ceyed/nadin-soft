import { applyDecorators, Controller, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROUTE_TYPE } from '../constants';
import { AuthType, NadinModulesEnum, UserRoleEnum } from '../enums';
import { RouteTypeEnum } from './../enums/route-type.enum';
import { Auth } from './auth.decorator';
import { Role } from './roles.decorator';

export function NadinController(
  module: NadinModulesEnum,
  controllerPath: string,
  routeType = RouteTypeEnum.NORMAL,
) {
  const decorators = [SetMetadata('module', module), ApiTags(module as string)];
  const path = _getPathPrefix(routeType) + controllerPath;

  if (routeType === RouteTypeEnum.PUBLIC) {
    decorators.push(Auth(AuthType.None));
  } else {
    decorators.push(ApiBearerAuth());
  }

  // * Check if the route type is ADMIN, then enforce ADMIN role
  if (routeType === RouteTypeEnum.ADMIN) {
    decorators.push(Role(UserRoleEnum.Admin));
  }

  decorators.push(SetMetadata(ROUTE_TYPE, routeType), Controller(path));
  return applyDecorators(...decorators);
}

function _getPathPrefix(routeType: RouteTypeEnum): string {
  switch (routeType) {
    case RouteTypeEnum.ADMIN:
      return 'admin/';
    case RouteTypeEnum.NORMAL:
      return 'normal/';
    default:
      return 'public/';
  }
}
