import { Type } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { ExternalDocumentationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface SharedCustomRouteInfoDto {
  summary?: string;
  description?: string;
  outputType?: Type<unknown> | ClassConstructor<any>;
  outputIsArray?: boolean;
  externalDocs?: ExternalDocumentationObject;
}

export type SharedUpdateRouteInfoDto = Partial<SharedCustomRouteInfoDto>;
