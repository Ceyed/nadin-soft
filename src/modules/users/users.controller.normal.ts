import { Body, Get, Param, Patch } from '@nestjs/common';
import { NadinController, NadinModulesEnum, Role, RouteTypeEnum, UserRoleEnum } from 'libs/src';
import { UpdateUserDto } from '../../../libs/src/lib/dto/user/update-user.dto';
import { UsersService } from './users.service';

@NadinController(NadinModulesEnum.User, 'users', RouteTypeEnum.ADMIN)
export class UsersNormalController {
  constructor(private readonly _usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this._usersService.update(+id, updateUserDto);
  }
}
