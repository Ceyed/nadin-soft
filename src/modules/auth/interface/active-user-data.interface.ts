import { UserRoleEnum } from 'src/users/enums/role.enum';

export interface ActiveUserData {
  sub: string;
  email: string;
  role: UserRoleEnum;
}
