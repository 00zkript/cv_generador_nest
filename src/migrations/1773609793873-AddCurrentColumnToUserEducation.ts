import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrentColumnToUserEducation1773609793873 implements MigrationInterface {
    name = 'AddCurrentColumnToUserEducation1773609793873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_education" ADD COLUMN "current" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_education" DROP COLUMN "current"`);
    }
}
