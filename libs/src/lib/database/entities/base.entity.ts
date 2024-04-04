import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuid } from '../../constants';

export class BaseEntity {
  @ApiProperty({ format: 'uuid', type: 'string' })
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  @IsUUID()
  id: uuid;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', type: 'timestamp' })
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    type: 'timestamp',
  })
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Exclude()
  public deletedAt: Date;
}
