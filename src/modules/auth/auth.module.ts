import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'libs/src/lib/database/entities';
import { jwtConfig } from 'src/app/configs/jwt.config';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage/refresh-token-ids.storage';
import { AccessTokenGuard, AuthenticationGuard, RoleGuard } from 'libs/src';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthenticationController],
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
  ],
})
export class AuthModule {}
