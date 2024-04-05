import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as fs from 'fs';
import {
  FilterUserDto,
  OrderDto,
  PaginationDto,
  UpdateResultModel,
  UserAuthModel,
  uuid,
} from 'libs/src';
import {
  FileEntity,
  FileRepository,
  UserEntity,
  UserRepository,
} from 'libs/src/lib/database/entities';
import { appConfig, AppConfig } from 'src/app/configs/app.config';
import { jwtConfig } from 'src/app/configs/jwt.config';
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
    @Inject(appConfig.KEY)
    private readonly _appConfig: AppConfig,
  ) {}

  getAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    user: UserAuthModel,
    filters: FilterUserDto,
  ): Promise<[UserEntity[], number]> {
    return this._userRepository.getAllWithPagination(pagination, order, user, filters);
  }

  async update(id: uuid, updateUserDto: UpdateUserDto): Promise<UpdateResultModel> {
    if (updateUserDto?.password) {
      updateUserDto.password = await this._hashingService.hash(
        updateUserDto.password + this._jwtConfig.pepper,
      );
    }
    return this._userRepository.edit(id, updateUserDto);
  }

  async uploadAvatar(user: UserAuthModel, file: Express.Multer.File): Promise<UpdateResultModel> {
    const savedUser: UserEntity = await this._userRepository.getOneOrFail(user.sub);
    if (savedUser.avatar) {
      this._deleteOldAvatar(savedUser.avatar);
    }

    const linkPrefix: string = `http://${this._appConfig.host}:${this._appConfig.port}`;
    const savedFile: FileEntity = await this._fileRepository.addAvatar(file, linkPrefix);

    return this._userRepository.edit(user.sub, { avatarId: savedFile.id });
  }

  private _deleteOldAvatar(avatar: FileEntity): void {
    fs.unlinkSync(avatar.path);
    this._fileRepository.softDelete(avatar.id);
  }
}
