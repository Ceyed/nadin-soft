import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiQueryOrder() {
  return applyDecorators(
    ApiQuery({ name: 'orderBy', type: 'string', required: false }),
    ApiQuery({ name: 'order', type: 'enum', required: false, enum: ['asc', 'desc'] }),
  );
}
