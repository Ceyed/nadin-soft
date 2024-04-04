import 'dotenv/config';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const NadinDataSource = new DataSource({
  type: 'mysql',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  host: process.env.DB_HOST,
  port: parseInt(`${process.env.DB_PORT || 3306}`),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: false,
  migrations: [`${path.join(__dirname, './')}migrations/*.{ts,js}`],
  entities: [`${path.join(__dirname, './')}entities/**/*.entity.{ts,js}`],
  migrationsTableName: 'migrations',
});
