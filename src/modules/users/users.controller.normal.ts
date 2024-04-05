import { Body } from '@nestjs/common';
import {
  NadinController,
  NadinModulesEnum,
  PutInfo,
  RouteTypeEnum,
  UpdateResultModel,
  User,
  uuid,
} from 'libs/src';
import { UpdateUserDto } from '../../../libs/src/lib/dto/user/update-user.dto';
import { UsersService } from './users.service';

@NadinController(NadinModulesEnum.User, 'users', RouteTypeEnum.NORMAL)
export class UsersNormalController {
  constructor(private readonly _usersService: UsersService) {}

  @PutInfo('', null, UpdateUserDto, false, {
    summary: 'update user info',
    description: "this route updates active user's info",
    outputType: UpdateResultModel,
  })
  update(@Body() updateUserDto: UpdateUserDto, @User('sub') id: uuid): Promise<UpdateResultModel> {
    return this._usersService.update(id, updateUserDto);
  }
}
