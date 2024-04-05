import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UPLOAD_MAX_LIMIT } from 'src/app/configs/upload.config';

export function ApiMultiFile(required: boolean = true): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    ApiBody({
      type: 'multipart/form-data',
      required,
      schema: {
        type: 'object',
        required: required ? ['files'] : [],
        properties: {
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

function ApiOneFile(fileName: string = 'file', required = false): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      type: 'multipart/form-data',
      required: required,
      schema: {
        type: 'object',
        required: required ? [fileName] : [],
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
}

export function ApiCustomFile(multipleFiles = false, required = false) {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    multipleFiles ? ApiMultiFile(required) : ApiOneFile('file', required),
    UseInterceptors(
      multipleFiles
        ? FilesInterceptor('files', null, { limits: { fileSize: UPLOAD_MAX_LIMIT } })
        : FileInterceptor('file', {
            limits: { fileSize: UPLOAD_MAX_LIMIT },
          }),
    ),
  );
}
