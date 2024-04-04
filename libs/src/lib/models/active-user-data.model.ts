import { UserRoleEnum } from '../enums/role.enum';

export interface UserAuthModel {
  sub: string;
  email: string;
  role: UserRoleEnum;
}
