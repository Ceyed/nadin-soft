import { Delete, Get, Param } from '@nestjs/common';
import { NadinController, NadinModulesEnum, RouteTypeEnum } from 'libs/src';
import { UsersService } from './users.service';

@NadinController(NadinModulesEnum.User, 'users', RouteTypeEnum.PUBLIC)
export class UsersPublicController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
