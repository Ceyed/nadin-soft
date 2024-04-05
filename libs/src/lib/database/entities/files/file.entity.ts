import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { uuid } from 'libs/src/lib/constants';
import { Column, Entity, FileLogger, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TaskEntity } from '../tasks';
import { UserEntity } from '../users';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @Column()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  link: string;

  @Column()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  path: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  taskId?: uuid;

  @ManyToOne(() => TaskEntity, (task) => task.files, { nullable: true })
  @JoinColumn({ name: 'taskId' })
  task?: UserEntity;
}
