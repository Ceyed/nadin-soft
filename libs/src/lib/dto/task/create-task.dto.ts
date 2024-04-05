import { PickType } from '@nestjs/swagger';
import { TaskEntity } from '../../database/entities';

export class CreateTaskDto extends PickType(TaskEntity, ['name', 'description'] as const) {}
