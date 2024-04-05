import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto, UpdateResultModel, UpdateTaskDto, UserAuthModel, uuid } from 'libs/src';
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
    readonly _taskRepository: TaskRepository,
    private readonly _fileRepository: FileRepository,
    @Inject(appConfig.KEY)
    private readonly _appConfig: AppConfig,
  ) {}

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
}
