import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateTaskDto,
  FilterTasksDto,
  OrderDto,
  PaginationDto,
  UpdateResultModel,
  UpdateTaskDto,
  UserAuthModel,
  uuid,
} from 'libs/src';
import {
  FileEntity,
  FileRepository,
  TaskEntity,
  TaskRepository,
} from 'libs/src/lib/database/entities';
import { appConfig, AppConfig } from 'src/app/configs/app.config';

@Injectable()
export class TaskService {
  constructor(
    private readonly _taskRepository: TaskRepository,
    private readonly _fileRepository: FileRepository,
    @Inject(appConfig.KEY)
    private readonly _appConfig: AppConfig,
  ) {}

  async findAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    user: UserAuthModel,
    filters: FilterTasksDto,
  ): Promise<[TaskEntity[], number]> {
    if (filters && Object.keys(filters).length) this._validateDatesInFilter(filters);
    return this._taskRepository.findAllWithPagination(pagination, order, user, filters);
  }

  async create(createTaskDto: CreateTaskDto, user: UserAuthModel): Promise<TaskEntity> {
    return this._taskRepository.add({
      ...createTaskDto,
      userId: user.sub,
    });
  }

  async uploadFiles(
    id: uuid,
    user: UserAuthModel,
    files: Express.Multer.File[],
  ): Promise<UpdateResultModel> {
    await this._taskRepository.getOneOrFail(id, user.sub);

    const linkPrefix: string = `${this._appConfig.host}:${this._appConfig.port}`;
    const savedFiles: FileEntity[] = await this._fileRepository.add(files, id, linkPrefix);

    return { status: !!savedFiles.length };
  }

  async update(
    id: uuid,
    user: UserAuthModel,
    updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateResultModel> {
    await this._taskRepository.getOneOrFail(id, user.sub);
    return this._taskRepository.edit(id, updateTaskDto);
  }

  async remove(id: uuid, user: UserAuthModel): Promise<UpdateResultModel> {
    await this._taskRepository.getOneOrFail(id, user.sub);
    await this._softDeleteFiles(id);
    return this._taskRepository.destroy(id);
  }

  private async _softDeleteFiles(taskId: uuid): Promise<void> {
    await this._fileRepository.softDelete({ taskId });
  }

  private _validateDatesInFilter(filters: FilterTasksDto): void {
    if ((filters?.fromDate && !filters?.toDate) || (!filters?.fromDate && filters?.toDate)) {
      throw new BadRequestException('fromDate and toDate is required');
    }
    if (filters?.fromDate > filters?.toDate) {
      throw new BadRequestException('fromDate must be less than toDate');
    }
  }
}
