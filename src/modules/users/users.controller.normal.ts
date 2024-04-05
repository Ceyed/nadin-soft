import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NadinController, NadinModulesEnum, RouteTypeEnum } from 'libs/src';
import { CreateUserDto } from '../../../libs/src/lib/dto/create-user.dto';
import { UpdateUserDto } from '../../../libs/src/lib/dto/update-user.dto';
import { UsersService } from './users.service';

@NadinController(NadinModulesEnum.User, 'users', RouteTypeEnum.NORMAL)
export class UsersNormalController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
