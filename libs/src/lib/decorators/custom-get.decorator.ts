import { applyDecorators, Get, SetMetadata, Type } from '@nestjs/common';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { SharedCustomRouteInfoDto } from '../dto';
import { getSharedDecorators } from './get-shared-decorators';
import { ApiFilterQuery } from './api-filter-query';

export type ApiCustomParamOption = { enum: SwaggerEnumType };

export function GetInfo(
  path: string,
  paramNames: string[] | Record<string, ApiCustomParamOption>,
  info: SharedCustomRouteInfoDto,
  queryName?: string,
  queryType?: Type<unknown>,
) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [Get(path)];

  decorators.push(...getSharedDecorators(path, info, paramNames));

  if (queryName) {
    decorators.push(ApiFilterQuery(queryName, queryType as Function));
  }
  return applyDecorators(...decorators);
}
