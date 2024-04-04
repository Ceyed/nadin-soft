import 'dotenv/config';
import 'reflect-metadata';
import { NADIN_DB_CONFIG } from 'src/app/app.module';
import { DataSource } from 'typeorm';

export const NadinDataSource = new DataSource({
  type: 'postgres',
  schema: 'public',
  synchronize: false,
  host: process.env['TYPEORM_HOST'],
  port: +process.env['TYPEORM_PORT'],
  username: process.env['TYPEORM_USERNAME'],
  password: process.env['TYPEORM_PASSWORD'],
  database: process.env['TYPEORM_DATABASE'],
  migrations: NADIN_DB_CONFIG.migrations,
  entities: NADIN_DB_CONFIG.entities,
  migrationsTableName: 'migrations',
});
