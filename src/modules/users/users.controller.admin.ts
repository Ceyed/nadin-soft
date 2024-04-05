import { Body, Param, ParseUUIDPipe, Query, UploadedFile } from '@nestjs/common';
import {
  ApiCustomFile,
  FilterUserDto,
  GetWithPagination,
  NadinController,
  NadinModulesEnum,
  OrderDto,
  PaginationDto,
  PutInfo,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum,
  UpdateResultModel,
  UpdateUserDto,
  User,
  UserAuthModel,
  uuid,
} from 'libs/src';
import { Paginate } from 'libs/src/lib/classes';
import { UserEntity } from 'libs/src/lib/database/entities';
import { UsersService } from './users.service';

@NadinController(NadinModulesEnum.User, 'users', RouteTypeEnum.ADMIN)
export class UsersAdminController {
  constructor(private readonly _usersService: UsersService) {}

  @GetWithPagination(
    'all',
    {
      description: 'this route returns all the banks',
      summary: 'get all bank',
    },
    UserEntity,
    'filters',
    FilterUserDto,
  )
  async findAll(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
    @User() user: UserAuthModel,
    @Query('filters') filters: FilterUserDto,
  ): Promise<Paginate<UserEntity>> {
    const [users, total] = await this._usersService.getAllWithPagination(
      pagination,
      order,
      user,
      filters,
    );
    return new Paginate(users, pagination.getPagination(total));
  }

  @PutInfo('update-user/:id', ['id'], UpdateUserDto, false, {
    summary: 'update user profile',
    description: "this route updates any user's profile",
    outputType: UpdateResultModel,
  })
  update(
    @Param('id', ParseUUIDPipe) id: uuid,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResultModel> {
    return this._usersService.update(id, updateUserDto);
  }

  @PutInfo('upload-avatar/:id', ['id'], null, false, {
    summary: 'upload avatar',
    description: 'upload avatar for active user',
    outputType: UpdateResultModel,
  })
  @ApiCustomFile(false, true)
  create(
    @Param('id', ParseUUIDPipe) id: uuid,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateResultModel> {
    return this._usersService.uploadAvatar(id, file);
  }
}
