import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationColumnToUserEducation1773609793874 implements MigrationInterface {
    name = 'AddLocationColumnToUserEducation1773609793874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_education" ADD COLUMN "location" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_education" DROP COLUMN "location"`);
    }
}
