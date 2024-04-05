import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { UPLOAD_DIRECTORY, uploadFileNameGenerator } from 'libs/src';
import {
  FileEntity,
  FileRepository,
  TaskEntity,
  TaskRepository,
} from 'libs/src/lib/database/entities';
import * as multer from 'multer';
import { appConfig } from 'src/app/configs/app.config';
import { TaskNormalController } from './task.normal.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, FileEntity]),
    ConfigModule.forFeature(appConfig),
    MulterModule.register({
      storage: multer.diskStorage({
        destination(request, response, callback) {
          fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
          callback(null, UPLOAD_DIRECTORY);
        },
        filename(request, file, callback) {
          const fileName = uploadFileNameGenerator(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [TaskNormalController],
  providers: [TaskService, TaskRepository, FileRepository],
})
export class TaskModule {}
