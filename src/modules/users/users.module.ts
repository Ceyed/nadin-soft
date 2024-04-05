import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserRepository } from 'libs/src/lib/database/entities';
import { jwtConfig } from 'src/app/configs/jwt.config';
import { BcryptService } from '../auth/hashing/bcrypt.service';
import { HashingService } from '../auth/hashing/hashing.service';
import { UsersNormalController } from './users.controller.normal';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [UsersNormalController],
  providers: [
    UsersService,
    UserRepository,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class UsersModule {}
