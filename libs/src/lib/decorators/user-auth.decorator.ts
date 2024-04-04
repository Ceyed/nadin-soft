import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/request-user-key.constant';
import { UserAuthModel } from '../models/active-user-data.model';

export const UserAuth = createParamDecorator(
  (field: keyof UserAuthModel | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserAuthModel | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
