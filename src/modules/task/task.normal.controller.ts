import { Body, Param, ParseUUIDPipe, UploadedFiles } from '@nestjs/common';
import {
  ApiCustomFile,
  CreateTaskDto,
  NadinController,
  NadinModulesEnum,
  PostInfo,
  PutInfo,
  RouteTypeEnum,
  UpdateResultModel,
  User,
  UserAuthModel,
  uuid,
} from 'libs/src';
import { TaskEntity } from 'libs/src/lib/database/entities';
import 'multer';
import { TaskService } from './task.service';

@NadinController(NadinModulesEnum.Task, 'tasks', RouteTypeEnum.NORMAL)
export class TaskNormalController {
  constructor(private readonly _taskService: TaskService) {}

  @PostInfo('', CreateTaskDto, false, {
    summary: 'create task',
    description: 'create task by user',
    outputType: TaskEntity,
  })
  create(@Body() createTaskDto: CreateTaskDto, @User() user: UserAuthModel) {
    return this._taskService.create(createTaskDto, user);
  }

  @PutInfo(':id', ['id'], null, false, {
    summary: 'upload files for a task',
    description: 'this route upload one or more files for a task that belongs to active user',
    outputType: UpdateResultModel,
  })
  @ApiCustomFile(true, true)
  update(
    @Param('id', ParseUUIDPipe) id: uuid,
    @User() user: UserAuthModel,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this._taskService.uploadFiles(id, user, files);
  }
}
