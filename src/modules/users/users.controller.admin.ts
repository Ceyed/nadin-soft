import { Query } from '@nestjs/common';
import {
  FilterUserDto,
  GetWithPagination,
  NadinController,
  NadinModulesEnum,
  OrderDto,
  PaginationDto,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum,
  User,
  UserAuthModel,
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
}
