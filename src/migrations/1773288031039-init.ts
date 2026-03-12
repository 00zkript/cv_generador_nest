import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773288031039 implements MigrationInterface {
    name = 'Init1773288031039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "cv_id" integer, "name" character varying(250) NOT NULL, "last_name" character varying(250) NOT NULL, "phone" character varying(250), "email" character varying(250), "linkedin" character varying, "github" character varying, "portafolio" character varying, "city" character varying(250), "country" character varying(250), "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_08a3e56c90e4f7e768baddd54c" UNIQUE ("cv_id"), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "languages" ("id" SERIAL NOT NULL, "cv_id" integer NOT NULL, "name" character varying(250) NOT NULL, "nivel" character varying(250) NOT NULL, "description" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skills" ("id" SERIAL NOT NULL, "cv_id" integer NOT NULL, "name" character varying(250) NOT NULL, "time_level" character varying(250) NOT NULL, "description" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "studies" ("id" SERIAL NOT NULL, "cv_id" integer NOT NULL, "center_study" character varying(250) NOT NULL, "title" character varying(250) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "description" character varying NOT NULL, "city" character varying(250) NOT NULL, "country" character varying(250) NOT NULL, "current" boolean NOT NULL DEFAULT false, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b100ff0c4a0ad02a9c2270d45b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cvs" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "subject" character varying NOT NULL, "version" character varying(250) NOT NULL, "resume" character varying(250) NOT NULL, "technical_contributions_projects" character varying, "language" character varying(20) NOT NULL, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_814a936bccc8d54fcec6173ba18" UNIQUE ("name"), CONSTRAINT "PK_e7d8a4d55eb4e7a2e43bea8d83a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "works_experiences" ("id" SERIAL NOT NULL, "cv_id" integer NOT NULL, "name" character varying(250) NOT NULL, "company" character varying(250) NOT NULL, "position" character varying(250) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "current" boolean NOT NULL DEFAULT false, "description" character varying(250) NOT NULL, "city" character varying(250) NOT NULL, "country" character varying(250) NOT NULL, "achievements" text, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0f18f06adb4da5ef0bae187afe4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "achievements" ("id" SERIAL NOT NULL, "work_experience_id" integer, "description" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_08a3e56c90e4f7e768baddd54cd" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "languages" ADD CONSTRAINT "FK_4685086f9d701f25f8527dd7f97" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skills" ADD CONSTRAINT "FK_e9fc8b5fb55c5acc3b37152633f" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "studies" ADD CONSTRAINT "FK_0a8e8100846be91ce1c41cf8596" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "works_experiences" ADD CONSTRAINT "FK_35969ab6b4628d6a6cd353cde74" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "works_experiences" DROP CONSTRAINT "FK_35969ab6b4628d6a6cd353cde74"`);
        await queryRunner.query(`ALTER TABLE "studies" DROP CONSTRAINT "FK_0a8e8100846be91ce1c41cf8596"`);
        await queryRunner.query(`ALTER TABLE "skills" DROP CONSTRAINT "FK_e9fc8b5fb55c5acc3b37152633f"`);
        await queryRunner.query(`ALTER TABLE "languages" DROP CONSTRAINT "FK_4685086f9d701f25f8527dd7f97"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_08a3e56c90e4f7e768baddd54cd"`);
        await queryRunner.query(`DROP TABLE "achievements"`);
        await queryRunner.query(`DROP TABLE "works_experiences"`);
        await queryRunner.query(`DROP TABLE "cvs"`);
        await queryRunner.query(`DROP TABLE "studies"`);
        await queryRunner.query(`DROP TABLE "skills"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
    }

}
