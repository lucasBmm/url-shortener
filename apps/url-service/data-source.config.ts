import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import configFactory from './src/config/configuration';

dotenv.config();

const { database } = configFactory();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: database.host,
  port: database.port,
  username: database.user,
  password: database.password,
  database: database.dbName,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/db/migrations/*.{ts,js}'],
  synchronize: false,
});
