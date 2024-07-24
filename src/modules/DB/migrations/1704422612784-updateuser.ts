import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updateuser1704422612784 implements MigrationInterface {
  name = 'Updateuser1704422612784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "test"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "test" character varying NOT NULL DEFAULT 'test migrations'`,
    );
  }
}
