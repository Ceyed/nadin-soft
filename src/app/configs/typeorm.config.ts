import { registerConfig } from 'libs/src';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum TYPEORM_CONFIG {
  TYPEORM_CONNECTION = 'TYPEORM_CONNECTION',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_PORT = 'TYPEORM_PORT',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_SYNCHRONIZE = 'TYPEORM_SYNCHRONIZE',
}

export class TypeormConfig {
  @IsString()
  connection: string;

  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  port = 3306;

  @IsString()
  @IsNotEmpty()
  database: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  synchronize = false;

  constructor(obj: Partial<TypeormConfig>) {
    Object.assign(this, obj);
  }
}

export const typeormConfig = registerConfig(TypeormConfig, () => {
  const port = process.env[TYPEORM_CONFIG.TYPEORM_PORT];
  const synchronize = process.env[TYPEORM_CONFIG.TYPEORM_SYNCHRONIZE];
  return new TypeormConfig({
    connection: process.env[TYPEORM_CONFIG.TYPEORM_CONNECTION],
    host: process.env[TYPEORM_CONFIG.TYPEORM_HOST],
    database: process.env[TYPEORM_CONFIG.TYPEORM_DATABASE],
    username: process.env[TYPEORM_CONFIG.TYPEORM_USERNAME],
    password: process.env[TYPEORM_CONFIG.TYPEORM_PASSWORD],
    synchronize: synchronize ? synchronize.toLowerCase() === 'true' : undefined,
    port: port ? +port : undefined,
  });
});
