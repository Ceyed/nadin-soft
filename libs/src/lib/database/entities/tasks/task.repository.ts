import { Injectable, NotFoundException } from '@nestjs/common';
import { uuid } from 'libs/src/lib/constants';
import { OrderDto, PaginationDto, UpdateTaskDto } from 'libs/src/lib/dto';
import { UpdateResultModel, UserAuthModel } from 'libs/src/lib/models';
import { DataSource, FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(private readonly _dataSource: DataSource) {
    super(TaskEntity, _dataSource.createEntityManager());
  }

  async findAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    user: UserAuthModel,
  ): Promise<[TaskEntity[], number]> {
    const options: FindManyOptions<TaskEntity> = {
      where: { userId: user.sub },
      relations: { files: true },
    };

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

  async getOneOrFail(id: uuid, userId?: uuid) {
    const task: TaskEntity = await this.findOneBy({ id, ...(userId && { userId }) });
    if (!task) throw new NotFoundException('Task not found!');
    return task;
  }

  add(data: Partial<TaskEntity>): Promise<TaskEntity> {
    const task: TaskEntity = this.create(data);
    return this.save(task);
  }

  async edit(id: uuid, updateTaskDto: UpdateTaskDto): Promise<UpdateResultModel> {
    const updateResult: UpdateResult = await this.update(id, updateTaskDto);
    return { status: !!updateResult.affected };
  }

  async destroy(id: uuid): Promise<UpdateResultModel> {
    const UpdateResult = await this.softDelete({ id });
    return { status: !!UpdateResult };
  }
}
