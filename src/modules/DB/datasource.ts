import { DataSource } from 'typeorm';
import { config as DOTENV } from 'dotenv';
import { ConfigService } from '@nestjs/config';
DOTENV();

const config = new ConfigService();

export const dataSource = new DataSource({
  type: 'postgres',
  host: config.getOrThrow('DB_HOST'),
  port: config.getOrThrow('DB_PORT'),
  database: config.getOrThrow('DB_NAME'),
  username: config.getOrThrow('DB_USERNAME'),
  password: config.getOrThrow('DB_PASS'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/DB/migrations/*{.ts,.js}'],
});
