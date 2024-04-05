import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UserAuthModel, uuid } from 'libs/src';
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
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new UserEntity();
      user.email = signUpDto.email;
      user.password = await this._hashingService.hash(signUpDto.password + this._jwtConfig.pepper);
      await this._userRepository.save(user);
    } catch (err) {
      throw new ConflictException();
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this._userRepository.findOneBy({ email: signInDto.email });
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

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this._jwtService.verifyAsync<
        Pick<UserAuthModel, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this._jwtConfig.secret,
        audience: this._jwtConfig.audience,
        issuer: this._jwtConfig.issuer,
      });
      const user: UserEntity = await this._userRepository.findOneByOrFail({ id: sub });
      const isValid: boolean = await this._refreshTokenIdsStorage.validate(user.id, refreshTokenId);
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

  async generateTokens(user: UserEntity) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this._signToken<Partial<UserAuthModel>>(user.id, this._jwtConfig.accessTokenTtl, {
        email: user.email,
        role: user.role,
      }),
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
}
