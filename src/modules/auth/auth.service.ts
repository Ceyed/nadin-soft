import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import {
  AccessTokenAndRefreshTokenDto,
  PASSWORD_VALIDATION_REGEX,
  RedisHelperService,
  RedisPrefixesEnum,
  RedisSubPrefixesEnum,
  UpdateResultModel,
  UserAuthModel,
  uuid,
} from 'libs/src';
import { UserEntity, UserRepository } from 'libs/src/lib/database/entities';
import { jwtConfig } from 'src/app/configs/jwt.config';
import { RefreshTokenDto } from '../../../libs/src/lib/dto/auth/refresh-token.dto';
import { SignInDto } from '../../../libs/src/lib/dto/auth/sign-in.dto';
import { SignUpDto } from '../../../libs/src/lib/dto/auth/sign-up.dto';
import { HashingService } from './hashing/hashing.service';
import { InvalidatedRefreshTokenError } from './refresh-token-ids-storage/invalidated-refresh-token-error.storage';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage/refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _hashingService: HashingService,
    private readonly _jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfig: ConfigType<typeof jwtConfig>,
    private readonly _refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly _redisHelperService: RedisHelperService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UpdateResultModel> {
    try {
      this._validatePassword(signUpDto.password);

      let user: UserEntity = new UserEntity();
      user.email = signUpDto.email;
      user.password = await this._hashingService.hash(
        signUpDto.password + this._jwtConfig.pepper,
      );
      user.mobile = signUpDto.mobile;
      user.username = signUpDto.username;
      user = await this._userRepository.save(user);
      this._removeUserTasksFromRedis();
      return { status: !!user };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      else
        throw new ConflictException(
          'User with this credentials already exists',
        );
    }
  }

  async signIn(signInDto: SignInDto): Promise<AccessTokenAndRefreshTokenDto> {
    const user = await this._userRepository.findOneBy({
      username: signInDto.username,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this._hashingService.compare(
      signInDto.password + this._jwtConfig.pepper,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    return this.generateTokens(user);
  }

  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AccessTokenAndRefreshTokenDto> {
    try {
      const { sub, refreshTokenId } = await this._jwtService.verifyAsync<
        Pick<UserAuthModel, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this._jwtConfig.secret,
        audience: this._jwtConfig.audience,
        issuer: this._jwtConfig.issuer,
      });
      const user: UserEntity = await this._userRepository.findOneByOrFail({
        id: sub,
      });
      const isValid: boolean = await this._refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this._refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Invalid refresh token');
      }
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied (Token compromised?)');
      }
      throw new UnauthorizedException();
    }
  }

  async generateTokens(
    user: UserEntity,
  ): Promise<AccessTokenAndRefreshTokenDto> {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this._signToken<Partial<UserAuthModel>>(
        user.id,
        this._jwtConfig.accessTokenTtl,
        {
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          username: user.username,
        },
      ),
      this._signToken(user.id, this._jwtConfig.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this._refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return { accessToken, refreshToken };
  }

  private async _signToken<T>(userId: uuid, expiresIn: number, payload?: T) {
    return await this._jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this._jwtConfig.audience,
        issuer: this._jwtConfig.issuer,
        secret: this._jwtConfig.secret,
        expiresIn,
      },
    );
  }

  private _validatePassword(password: string): void {
    if (!PASSWORD_VALIDATION_REGEX.test(password)) {
      throw new BadRequestException(
        'Password should contain 1 lower-case and 1 upper-case letter with total of 8 characters',
      );
    }
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
