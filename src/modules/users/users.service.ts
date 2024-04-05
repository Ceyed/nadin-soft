import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UpdateResultModel, uuid } from 'libs/src';
import { UserRepository } from 'libs/src/lib/database/entities';
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
  ) {}

  async update(id: uuid, updateUserDto: UpdateUserDto): Promise<UpdateResultModel> {
    if (updateUserDto?.password) {
      updateUserDto.password = await this._hashingService.hash(
        updateUserDto.password + this._jwtConfig.pepper,
      );
    }
    return this._userRepository.edit(id, updateUserDto);
  }
}
