import { Injectable } from '@nestjs/common';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { UpdateResultModel } from 'libs/src/lib/models';
import { uuid } from 'libs/src/lib/constants';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly _dataSource: DataSource) {
    super(UserEntity, _dataSource.createEntityManager());
  }

  async edit(id: uuid, data: Partial<UserEntity>): Promise<UpdateResultModel> {
    const updateResult: UpdateResult = await this.update(id, data);
    return { status: !!updateResult.affected };
  }
}
