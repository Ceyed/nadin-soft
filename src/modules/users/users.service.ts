import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as fs from 'fs';
import {
  FilterUserDto,
  OrderDto,
  PaginationDto,
  RedisHelperService,
  RedisPrefixesEnum,
  RedisSubPrefixesEnum,
  UpdateResultModel,
  UserAuthModel,
  UserRoleEnum,
  uuid,
} from 'libs/src';
import {
  FileEntity,
  FileRepository,
  TaskRepository,
  UserEntity,
  UserRepository,
} from 'libs/src/lib/database/entities';
import { appConfig, AppConfig } from 'src/app/configs/app.config';
import { jwtConfig } from 'src/app/configs/jwt.config';
import { In } from 'typeorm';
import { UpdateUserDto } from '../../../libs/src/lib/dto/user/update-user.dto';
import { HashingService } from '../auth/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfig: ConfigType<typeof jwtConfig>,
    private readonly _fileRepository: FileRepository,
    private readonly _taskRepository: TaskRepository,
    @Inject(appConfig.KEY)
    private readonly _appConfig: AppConfig,
    private readonly _redisHelperService: RedisHelperService,
  ) {}

  getAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    user: UserAuthModel,
    filters: FilterUserDto,
  ): Promise<[UserEntity[], number]> {
    const redisKey = this._getRedisKey();
    return this._redisHelperService.getFromCacheOrDb<[UserEntity[], number]>(
      redisKey,
      async () =>
        this._userRepository.getAllWithPagination(
          pagination,
          order,
          user,
          filters,
        ),
    );
  }

  async update(
    id: uuid,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResultModel> {
    if (updateUserDto?.password) {
      updateUserDto.password = await this._hashingService.hash(
        updateUserDto.password + this._jwtConfig.pepper,
      );
    }
    this._removeUserTasksFromRedis();
    return this._userRepository.edit(id, updateUserDto);
  }

  async uploadAvatar(
    id: uuid,
    file: Express.Multer.File,
  ): Promise<UpdateResultModel> {
    const savedUser: UserEntity = await this._userRepository.getOneOrFail(id);
    if (savedUser.avatar) {
      this._deleteOldAvatar(savedUser.avatar);
    }

    const linkPrefix: string = `http://${this._appConfig.host}:${this._appConfig.port}`;
    const savedFile: FileEntity = await this._fileRepository.addAvatar(
      file,
      linkPrefix,
    );

    this._removeUserTasksFromRedis();
    return this._userRepository.edit(id, { avatarId: savedFile.id });
  }

  async promote(id: uuid): Promise<UpdateResultModel> {
    const user: UserEntity = await this._userRepository.getOneOrFail(id);
    if (user.role === UserRoleEnum.Admin) {
      throw new BadRequestException('User is already admin!');
    }
    this._removeUserTasksFromRedis();
    return this._userRepository.edit(id, { role: UserRoleEnum.Admin });
  }

  async revoke(id: uuid): Promise<UpdateResultModel> {
    const user: UserEntity = await this._userRepository.getOneOrFail(id);
    if (user.role === UserRoleEnum.BaseUser) {
      throw new BadRequestException('User already has base role!');
    }
    this._removeUserTasksFromRedis();
    return this._userRepository.edit(id, { role: UserRoleEnum.BaseUser });
  }

  async remove(id: uuid): Promise<UpdateResultModel> {
    const user: UserEntity = await this._userRepository.getOneOrFail(id);
    this._deleteUserTasks(user);
    this._removeUserTasksFromRedis();
    return this._userRepository.destroy(id);
  }

  private _deleteOldAvatar(avatar: FileEntity): void {
    fs.unlinkSync(avatar.path);
    this._fileRepository.softDelete(avatar.id);
  }

  private _deleteUserTasks(user: UserEntity): void {
    // * Remove files
    const fileIds: uuid[] = user?.tasks
      ?.map((task) => task.files.map((file) => file.id))
      .flat();
    this._fileRepository.softDelete({
      id: In(fileIds),
    });
    user?.tasks?.map((task) =>
      task.files.map((file) => fs.unlinkSync(file.path)),
    );

    // * Remove tasks
    this._taskRepository.softDelete({ userId: user.id });
  }

  private _getRedisKey(): string {
    return this._redisHelperService.getStandardKeyWithoutId(
      RedisPrefixesEnum.User,
      RedisSubPrefixesEnum.All,
    );
  }

  private _removeUserTasksFromRedis(): void {
    const redisKey = this._getRedisKey();
    this._redisHelperService.removeCache(redisKey);
  }
}
