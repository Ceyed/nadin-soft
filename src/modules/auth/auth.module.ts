import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../../../libs/src/lib/guards/access-token.guard';
import { AuthenticationGuard } from '../../../libs/src/lib/guards/authentication.guard';
import { RoleGuard } from '../../../libs/src/lib/guards/roles.guard';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  imports: [
    //TypeOrmModule.forFeature([User]),
    //JwtModule.registerAsync(jwtConfig.asProvider()),
    //ConfigModule.forFeature(jwtConfig),
  ],
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
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class AuthModule {}
