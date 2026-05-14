import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/DB/migrations/*{.ts,.js}'],
});
