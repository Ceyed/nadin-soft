import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, isUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileEntity } from '../files';
import { UserEntity } from '../users';
import { uuid } from 'libs/src/lib/constants';

@Entity({ name: 'task' })
export class TaskEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @Column()
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: uuid;

  @OneToMany(() => FileEntity, (file) => file.task, { nullable: true })
  files: FileEntity[];

  @ManyToOne(() => UserEntity, (user) => user.tasks, { cascade: ['soft-remove'] })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
