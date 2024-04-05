import { Body, UploadedFile } from '@nestjs/common';
import {
  ApiCustomFile,
  NadinController,
  NadinModulesEnum,
  PutInfo,
  RouteTypeEnum,
  UpdateResultModel,
  User,
  UserAuthModel,
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

  @PutInfo('upload-avatar', null, null, false, {
    summary: 'upload avatar',
    description: 'upload avatar for active user',
    outputType: UpdateResultModel,
  })
  @ApiCustomFile(false, true)
  create(
    @User() user: UserAuthModel,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateResultModel> {
    return this._usersService.uploadAvatar(user, file);
  }
}
