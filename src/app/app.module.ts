import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TaskModule } from 'src/modules/task/task.module';
import { UsersModule } from 'src/modules/users/users.module';
import { DataSourceOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './configs/app.config';
import { jwtConfig } from './configs/jwt.config';
import { typeormConfig } from './configs/typeorm.config';
import { uploadConfig } from './configs/upload.config';

export const NADIN_DB_CONFIG: Pick<DataSourceOptions, 'entities' | 'migrations'> = {
  migrations: [`${path.join(__dirname, './')}migrations/*.{ts,js}`],
  entities: [`${path.join(__dirname, './')}entities/**/*.entity.{ts,js}`],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ConfigModule.forFeature(appConfig),
    ConfigModule.forFeature(typeormConfig),
    ConfigModule.forFeature(uploadConfig),
    ConfigModule.forFeature(jwtConfig),
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
        }) as DataSourceOptions,
      inject: [typeormConfig.KEY],
    }),
    AuthModule,
    UsersModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
