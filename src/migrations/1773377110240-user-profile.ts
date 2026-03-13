import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProfile1773377110240 implements MigrationInterface {
    name = 'UserProfile1773377110240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "lastname" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "linkedin" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "github" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "twitter" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "portfolio" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "about_me" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "about_me"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "portfolio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "twitter"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "github"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "linkedin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastname"`);
    }
}
