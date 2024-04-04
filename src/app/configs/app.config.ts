// import { registerConfig } from '@nadin/libs/utils';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { registerConfig } from 'libs/src/lib/utils/register-config.util';

export enum APP_CONFIG {
  NODE_ENV = 'NODE_ENV',
  HOST = 'HOST',
  PORT = 'PORT',
}

export class AppConfig {
  @IsString()
  @IsNotEmpty()
  @IsIn(['development', 'production'])
  nodeEnv = 'production';

  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  port = 4213;

  constructor(obj: Partial<AppConfig>) {
    Object.assign(this, obj);
  }
}

export const appConfig = registerConfig(AppConfig, () => {
  return new AppConfig({
    nodeEnv: process.env[APP_CONFIG.NODE_ENV] ?? 'production',
    host: process.env[APP_CONFIG.HOST],
    port: parseInt(process.env[APP_CONFIG.PORT] ?? '4213', 10),
  });
});
