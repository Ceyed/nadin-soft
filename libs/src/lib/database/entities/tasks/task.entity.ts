import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { uuid } from 'libs/src/lib/constants';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileEntity } from '../files';
import { UserEntity } from '../users';

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

  @OneToMany(() => FileEntity, (file) => file.task, {
    nullable: true,
  })
  files: FileEntity[];

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
