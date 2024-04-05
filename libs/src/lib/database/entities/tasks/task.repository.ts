import { Injectable, NotFoundException } from '@nestjs/common';
import { uuid } from 'libs/src/lib/constants';
import { UpdateTaskDto } from 'libs/src/lib/dto';
import { UpdateResultModel } from 'libs/src/lib/models';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(private readonly _dataSource: DataSource) {
    super(TaskEntity, _dataSource.createEntityManager());
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
