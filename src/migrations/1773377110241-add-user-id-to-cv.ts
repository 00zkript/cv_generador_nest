import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToCv1773377110241 implements MigrationInterface {
    name = 'AddUserIdToCv1773377110241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cvs" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "cvs" ADD CONSTRAINT "FK_cvs_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cvs" DROP CONSTRAINT "FK_cvs_user"`);
        await queryRunner.query(`ALTER TABLE "cvs" DROP COLUMN "user_id"`);
    }
}
