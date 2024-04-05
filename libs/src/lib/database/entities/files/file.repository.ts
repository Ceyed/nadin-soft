import { Injectable } from '@nestjs/common';
import { uuid } from 'libs/src/lib/constants';
import { DataSource, Repository } from 'typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(private readonly _dataSource: DataSource) {
    super(FileEntity, _dataSource.createEntityManager());
  }

  addAttachmentForTask(
    files: Express.Multer.File[],
    taskId: uuid,
    linkPrefix: string,
  ): Promise<FileEntity[]> {
    return this.save(
      files.map((file) => ({
        name: file.filename,
        originalName: file.originalname,
        link: linkPrefix + '/' + file.path,
        path: file.path,
        taskId,
      })),
    );
  }

  addAvatar(file: Express.Multer.File, linkPrefix: string): Promise<FileEntity> {
    console.log({ file });
    return this.save({
      name: file.filename,
      originalName: file.originalname,
      link: linkPrefix + '/' + file.path,
      path: file.path,
    });
  }
}
