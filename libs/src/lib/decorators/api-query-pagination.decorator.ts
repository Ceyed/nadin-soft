import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiQueryPagination() {
  return applyDecorators(
    ApiQuery({ name: 'page', type: 'number' }),
    ApiQuery({ name: 'size', type: 'number' }),
  );
}
