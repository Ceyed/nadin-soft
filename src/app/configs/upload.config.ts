import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { registerConfig } from '../../../libs/src/lib/utils/register-config.util';

export enum UPLOAD_CONFIG {
  UPLOAD_MAX_LIMIT_MB = 'UPLOAD_MAX_LIMIT_MB',
}

export class UploadConfig {
  @IsNumber()
  @IsNotEmpty()
  maxLimit: number;

  constructor(obj: Partial<UploadConfig>) {
    Object.assign(this, obj);
  }
}

export const uploadConfig = registerConfig(UploadConfig, () => {
  const maxLimit = process.env[UPLOAD_CONFIG.UPLOAD_MAX_LIMIT_MB]
    ? +process.env[UPLOAD_CONFIG.UPLOAD_MAX_LIMIT_MB] * 1250000
    : undefined;

  return new UploadConfig({
    maxLimit: maxLimit ? maxLimit : undefined,
  });
});

export const UPLOAD_MAX_LIMIT = process.env[UPLOAD_CONFIG.UPLOAD_MAX_LIMIT_MB]
  ? +process.env[UPLOAD_CONFIG.UPLOAD_MAX_LIMIT_MB] * 1250000
  : undefined;
