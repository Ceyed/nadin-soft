import { applyDecorators, Get, Type } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ExternalDocumentationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { applyRouteParams } from '../utils';
import { ApiFilterQuery } from './api-filter-query';
import { ApiPaginatedResponse } from './api-paginated-response';
import { ApiQueryOrder } from './api-query-order.decorator';
import { ApiQueryPagination } from './api-query-pagination.decorator';
import { ApiCustomParamOption } from './custom-get.decorator';

/**
 *
 * @param path
 * @param info
 * @param paginationEntityResponse
 * @param queryName
 * @param queryType
 * @param paramNames
 * @param overrideResponse
 **/
export function GetWithPagination(
  path: string,
  info: {
    summary: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
  },
  paginationEntityResponse: Type<any>,
  queryName?: string,
  queryType?: Type<unknown>,
  paramNames?: string[] | Record<string, ApiCustomParamOption>,
  overrideResponse?: boolean,
) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    Get(path !== '/' && path !== '' ? `/paginated/${path}` : 'paginated'),
  ];
  decorators.push(
    ApiQueryOrder(),
    ApiQueryPagination(),
    ApiOperation({
      ...info,
    }),
  );
  if (overrideResponse) {
    decorators.push(
      ApiOkResponse({
        type: () => paginationEntityResponse,
      }),
    );
  } else {
    decorators.push(ApiPaginatedResponse(paginationEntityResponse));
  }
  if (queryName) {
    decorators.push(ApiFilterQuery(queryName, queryType as Function));
  }
  if (paramNames && paramNames?.length) {
    decorators.push(...applyRouteParams(path, paramNames));
  }
  return applyDecorators(...decorators);
}
