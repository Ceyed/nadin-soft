import { Body, Param, ParseUUIDPipe, Query, UploadedFiles } from '@nestjs/common';
import {
  ApiCustomFile,
  CreateTaskDto,
  DeleteInfo,
  FilterTasksDto,
  GetWithPagination,
  NadinController,
  NadinModulesEnum,
  OrderDto,
  PaginationDto,
  PostInfo,
  PutInfo,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum,
  UpdateResultModel,
  UpdateTaskDto,
  User,
  UserAuthModel,
  uuid,
} from 'libs/src';
import { Paginate } from 'libs/src/lib/classes';
import { TaskEntity } from 'libs/src/lib/database/entities';
import 'multer';
import { TaskService } from './task.service';

@NadinController(NadinModulesEnum.Task, 'tasks', RouteTypeEnum.NORMAL)
export class TaskNormalController {
  constructor(private readonly _taskService: TaskService) {}

  @GetWithPagination(
    'all',
    {
      description: 'this route returns all the banks',
      summary: 'get all bank',
    },
    TaskEntity,
    'filters',
    FilterTasksDto,
  )
  async findAll(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
    @User() user: UserAuthModel,
    @Query('filters') filters: FilterTasksDto,
  ): Promise<Paginate<TaskEntity>> {
    const [tasks, total] = await this._taskService.findAllWithPagination(
      pagination,
      order,
      user,
      filters,
    );
    return new Paginate(tasks, pagination.getPagination(total));
  }

  @PostInfo('', CreateTaskDto, false, {
    summary: 'create task',
    description: 'create task by user',
    outputType: TaskEntity,
  })
  create(@Body() createTaskDto: CreateTaskDto, @User() user: UserAuthModel) {
    return this._taskService.create(createTaskDto, user);
  }

  @PutInfo('upload/:id', ['id'], null, false, {
    summary: 'upload files for a task',
    description: 'this route upload one or more files for a task that belongs to active user',
    outputType: UpdateResultModel,
  })
  @ApiCustomFile(true, true)
  upload(
    @Param('id', ParseUUIDPipe) id: uuid,
    @User() user: UserAuthModel,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UpdateResultModel> {
    return this._taskService.uploadFiles(id, user, files);
  }

  @PutInfo(':id', ['id'], UpdateTaskDto, false, {
    summary: 'update task',
    description: 'this route upload a task that belongs to active user',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id', ParseUUIDPipe) id: uuid,
    @User() user: UserAuthModel,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateResultModel> {
    return this._taskService.update(id, user, updateTaskDto);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete one task',
    description: 'this route deletes one task that belongs to active user',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: uuid,
    @User() user: UserAuthModel,
  ): Promise<UpdateResultModel> {
    return this._taskService.remove(id, user);
  }
}
