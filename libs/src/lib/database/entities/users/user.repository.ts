import { Injectable, NotFoundException } from '@nestjs/common';
import { uuid } from 'libs/src/lib/constants';
import { FilterUserDto, OrderDto, PaginationDto } from 'libs/src/lib/dto';
import { UpdateResultModel, UserAuthModel } from 'libs/src/lib/models';
import { DataSource, FindManyOptions, Like, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly _dataSource: DataSource) {
    super(UserEntity, _dataSource.createEntityManager());
  }

  getAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    user: UserAuthModel,
    filters: FilterUserDto,
  ) {
    const options: FindManyOptions<UserEntity> = {
      where: [],
      relations: { avatar: true, tasks: { files: true } },
    };

    if (filters && Object.keys(filters).length) {
      let baseFilters = {};
      if (filters?.role) {
        baseFilters = { role: filters.role };
      }
      if (filters?.searchTerm) {
        baseFilters = [
          { ...baseFilters, email: Like(`%${filters.searchTerm}%`) },
          { ...baseFilters, mobile: Like(`%${filters.searchTerm}%`) },
          { ...baseFilters, username: Like(`%${filters.searchTerm}%`) },
        ];
      }

      options.where = baseFilters;
    }

    if (order?.order) {
      options.order = { [order.order]: order.orderBy };
    } else {
      options.order = { createdAt: 'DESC' };
    }
    if (pagination) {
      options.skip = pagination.skip;
      options.take = pagination.size;
    }

    return this.findAndCount(options);
  }

  async getOneOrFail(id: uuid): Promise<UserEntity> {
    const user: UserEntity = await this.findOne({ where: { id }, relations: { avatar: true } });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async edit(id: uuid, data: Partial<UserEntity>): Promise<UpdateResultModel> {
    const updateResult: UpdateResult = await this.update(id, data);
    return { status: !!updateResult.affected };
  }
}
