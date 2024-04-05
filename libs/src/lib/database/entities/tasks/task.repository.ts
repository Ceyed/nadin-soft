import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { uuid } from 'libs/src/lib/constants';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(private readonly _dataSource: DataSource) {
    super(TaskEntity, _dataSource.createEntityManager());
  }

  async getOneOrFail(id: uuid) {
    const task: TaskEntity = await this.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found!');
    return task;
  }

  add(data: Partial<TaskEntity>): Promise<TaskEntity> {
    const task: TaskEntity = this.create(data);
    return this.save(task);
  }
}
