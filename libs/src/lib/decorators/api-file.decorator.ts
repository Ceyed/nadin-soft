import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UPLOAD_MAX_LIMIT } from 'src/app/configs/upload.config';
import { ApiCustomFileParamsInterface } from '../interface';

export function ApiMultiFile(
  required: boolean = true,
  bodyData?: ApiCustomFileParamsInterface,
): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    ApiBody({
      type: 'multipart/form-data',
      required,
      schema: {
        type: 'object',
        required: (required ? ['files'] : []).concat(
          ...(bodyData?.requiredBodyFields ? bodyData.requiredBodyFields : []),
        ),
        properties: {
          ...(bodyData?.body && bodyData.body),
          ['files']: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
}

function ApiOneFile(
  fileName: string = 'file',
  required = false,
  bodyData?: ApiCustomFileParamsInterface,
): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      type: 'multipart/form-data',
      required: required,
      schema: {
        type: 'object',
        required: (required ? ['file'] : []).concat(
          ...(bodyData?.requiredBodyFields ? bodyData.requiredBodyFields : []),
        ),
        properties: {
          ...(bodyData?.body && bodyData.body),
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
}

export function ApiCustomFile(
  multipleFiles = false,
  required = false,
  bodyData?: ApiCustomFileParamsInterface,
) {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    multipleFiles ? ApiMultiFile(required, bodyData) : ApiOneFile('file', required, bodyData),
    UseInterceptors(
      multipleFiles
        ? FilesInterceptor('files', null, { limits: { fileSize: UPLOAD_MAX_LIMIT } })
        : FileInterceptor('file', {
            limits: { fileSize: UPLOAD_MAX_LIMIT },
          }),
    ),
  );
}
