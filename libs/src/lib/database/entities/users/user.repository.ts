import { Injectable, NotFoundException } from '@nestjs/common';
import { uuid } from 'libs/src/lib/constants';
import { UpdateResultModel } from 'libs/src/lib/models';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly _dataSource: DataSource) {
    super(UserEntity, _dataSource.createEntityManager());
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
