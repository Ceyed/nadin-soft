import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { ConfigFactoryKeyHost } from '@nestjs/config/dist/utils/register-as.util';
import { registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import 'dotenv/config';

export declare type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export function registerConfig<
  TConfig extends Record<string, any>,
  TFactory extends ConfigFactory = ConfigFactory<TConfig>,
>(
  classConstructor: ClassConstructor<TConfig>,
  configFactory: () => void,
): (() => TConfig) & ConfigFactoryKeyHost {
  const instance = plainToClass(classConstructor, configFactory(), {
    exposeDefaultValues: true,
  });
  const errors = validateSync(instance);
  if (errors.length > 0) {
    console.log('config instance is: ', instance);
    throw new Error(['Config Validation Error', ...errors.map((x) => x.toString())].join('\n'));
  }
  return registerAs(classConstructor.name, () => instance);
}
