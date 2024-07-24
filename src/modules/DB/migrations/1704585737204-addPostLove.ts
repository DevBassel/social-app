import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostLove1704585737204 implements MigrationInterface {
  name = 'AddPostLove1704585737204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_love" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0ec0f0be6fdf6f792ccd07cff28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_love" ADD CONSTRAINT "FK_453ce61b142e19ddb7375675634" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_love" ADD CONSTRAINT "FK_b6d2607748e4863c0e508a67c02" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_love" DROP CONSTRAINT "FK_b6d2607748e4863c0e508a67c02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_love" DROP CONSTRAINT "FK_453ce61b142e19ddb7375675634"`,
    );
    await queryRunner.query(`DROP TABLE "post_love"`);
  }
}
