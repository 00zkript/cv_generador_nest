import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPositionColumn1773609793872 implements MigrationInterface {
    name = 'AddPositionColumn1773609793872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_skills" ADD COLUMN "position" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user_experiences" ADD COLUMN "position" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user_education" ADD COLUMN "position" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user_projects" ADD COLUMN "position" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "cv_job_keywords" ADD COLUMN "position" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "cv_versions" ADD COLUMN "position" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv_versions" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "cv_job_keywords" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "user_projects" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "user_education" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "user_experiences" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP COLUMN "position"`);
    }
}
