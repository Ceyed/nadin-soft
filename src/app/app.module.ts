import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeormConfig } from './configs/typeorm.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

export const NADIN_DB_CONFIG: Pick<
  DataSourceOptions,
  'entities' | 'migrations'
> = {
  migrations: [`${path.join(__dirname, './')}migrations/*.{ts,js}`],
  entities: [`${path.join(__dirname, './')}entities/**/*.entity.{ts,js}`],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ConfigModule.forFeature(typeormConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeormConfig)],
      useFactory: (typeormConfigService: ConfigType<typeof typeormConfig>) =>
        ({
          schema: 'public',
          type: typeormConfigService.connection,
          host: typeormConfigService.host,
          port: typeormConfigService.port,
          username: typeormConfigService.username,
          password: typeormConfigService.password,
          database: typeormConfigService.database,
          entities: NADIN_DB_CONFIG.entities,
          synchronize: typeormConfigService.synchronize,
          migrations: NADIN_DB_CONFIG.migrations,
          logging: 'all',
          autoLoadEntities: true,
          migrationsTableName: 'migrations',
        } as DataSourceOptions),
      inject: [typeormConfig.KEY],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
