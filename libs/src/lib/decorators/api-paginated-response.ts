import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Paginate } from '../classes';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(Paginate) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
