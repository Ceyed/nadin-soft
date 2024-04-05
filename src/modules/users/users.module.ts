import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { AVATAR_UPLOAD_DIRECTORY, uploadFileNameGenerator } from 'libs/src';
import { FileRepository, UserEntity, UserRepository } from 'libs/src/lib/database/entities';
import * as multer from 'multer';
import { appConfig } from 'src/app/configs/app.config';
import { jwtConfig } from 'src/app/configs/jwt.config';
import { BcryptService } from '../auth/hashing/bcrypt.service';
import { HashingService } from '../auth/hashing/hashing.service';
import { UsersAdminController } from './users.controller.admin';
import { UsersNormalController } from './users.controller.normal';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(appConfig),
    MulterModule.register({
      storage: multer.diskStorage({
        destination(request, response, callback) {
          fs.mkdirSync(AVATAR_UPLOAD_DIRECTORY, { recursive: true });
          callback(null, AVATAR_UPLOAD_DIRECTORY);
        },
        filename(request, file, callback) {
          const fileName = uploadFileNameGenerator(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UsersNormalController, UsersAdminController],
  providers: [
    UsersService,
    UserRepository,
    FileRepository,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class UsersModule {}
