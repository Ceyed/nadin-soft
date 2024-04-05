import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenGuard, AuthenticationGuard, RoleGuard } from 'libs/src';
import { UserEntity, UserRepository } from 'libs/src/lib/database/entities';
import { jwtConfig } from 'src/app/configs/jwt.config';
import { AuthNormalController } from './auth.normal.controller';
import { AuthPublicController } from './auth.public.controller';
import { AuthenticationService } from './auth.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage/refresh-token-ids.storage';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthPublicController, AuthNormalController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AuthenticationService,
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    UserRepository,
  ],
})
export class AuthModule {}
