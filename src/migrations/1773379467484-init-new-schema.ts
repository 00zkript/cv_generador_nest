import { MigrationInterface, QueryRunner } from "typeorm";

export class InitNewSchema1773379467484 implements MigrationInterface {
    name = 'InitNewSchema1773379467484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" (
            "id" SERIAL NOT NULL,
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "name" character varying,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
            CONSTRAINT "PK_users" PRIMARY KEY ("id")
        )`);
        
        await queryRunner.query(`CREATE TABLE "user_profiles" (
            "id" SERIAL NOT NULL,
            "user_id" integer,
            "headline" character varying,
            "about" text,
            "phone" character varying,
            "location" character varying,
            "linkedin_url" character varying,
            "github_url" character varying,
            "portfolio_url" character varying,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_user_profiles" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "user_skills" (
            "id" SERIAL NOT NULL,
            "user_id" integer,
            "name" character varying,
            "level" character varying,
            "years_experience" integer,
            "category" character varying,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_user_skills" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "user_experiences" (
            "id" SERIAL NOT NULL,
            "user_id" integer,
            "company" character varying,
            "role" character varying,
            "start_date" date,
            "end_date" date,
            "is_current" boolean NOT NULL DEFAULT false,
            "description" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_user_experiences" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "user_experience_achievements" (
            "id" SERIAL NOT NULL,
            "experience_id" integer,
            "description" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_user_experience_achievements" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "user_education" (
            "id" SERIAL NOT NULL,
            "user_id" integer,
            "institution" character varying,
            "degree" character varying,
            "field_of_study" character varying,
            "start_date" date,
            "end_date" date,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_user_education" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "user_projects" (
            "id" SERIAL NOT NULL,
            "user_id" integer,
            "title" character varying,
            "description" text,
            "project_url" character varying,
            "github_url" character varying,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_user_projects" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "cvs" (
            "id" SERIAL NOT NULL,
            "user_id" integer,
            "title" character varying,
            "target_role" character varying,
            "target_company" character varying,
            "job_description" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cvs" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "cv_job_keywords" (
            "id" SERIAL NOT NULL,
            "cv_id" integer,
            "keyword" character varying,
            "weight" integer,
            CONSTRAINT "PK_cv_job_keywords" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "cv_versions" (
            "id" SERIAL NOT NULL,
            "cv_id" integer,
            "version_number" integer,
            "prompt_used" text,
            "content_json" jsonb,
            "ats_score" numeric,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cv_versions" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "cv_exports" (
            "id" SERIAL NOT NULL,
            "cv_version_id" integer,
            "template" character varying,
            "file_url" character varying,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cv_exports" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "cv_templates" (
            "id" SERIAL NOT NULL,
            "name" character varying,
            "layout" character varying,
            "description" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cv_templates" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "ai_prompt_logs" (
            "id" SERIAL NOT NULL,
            "cv_id" integer,
            "prompt" text,
            "response" jsonb,
            "model" character varying,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_ai_prompt_logs" PRIMARY KEY ("id")
        )`);
        
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_user_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_user_skills_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_experiences" ADD CONSTRAINT "FK_user_experiences_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_experience_achievements" ADD CONSTRAINT "FK_user_experience_achievements_experience" FOREIGN KEY ("experience_id") REFERENCES "user_experiences"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_education" ADD CONSTRAINT "FK_user_education_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_projects" ADD CONSTRAINT "FK_user_projects_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cvs" ADD CONSTRAINT "FK_cvs_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cv_job_keywords" ADD CONSTRAINT "FK_cv_job_keywords_cv" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cv_versions" ADD CONSTRAINT "FK_cv_versions_cv" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cv_exports" ADD CONSTRAINT "FK_cv_exports_cv_version" FOREIGN KEY ("cv_version_id") REFERENCES "cv_versions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_prompt_logs" ADD CONSTRAINT "FK_ai_prompt_logs_cv" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_prompt_logs" DROP CONSTRAINT "FK_ai_prompt_logs_cv"`);
        await queryRunner.query(`ALTER TABLE "cv_exports" DROP CONSTRAINT "FK_cv_exports_cv_version"`);
        await queryRunner.query(`ALTER TABLE "cv_versions" DROP CONSTRAINT "FK_cv_versions_cv"`);
        await queryRunner.query(`ALTER TABLE "cv_job_keywords" DROP CONSTRAINT "FK_cv_job_keywords_cv"`);
        await queryRunner.query(`ALTER TABLE "cvs" DROP CONSTRAINT "FK_cvs_user"`);
        await queryRunner.query(`ALTER TABLE "user_projects" DROP CONSTRAINT "FK_user_projects_user"`);
        await queryRunner.query(`ALTER TABLE "user_education" DROP CONSTRAINT "FK_user_education_user"`);
        await queryRunner.query(`ALTER TABLE "user_experience_achievements" DROP CONSTRAINT "FK_user_experience_achievements_experience"`);
        await queryRunner.query(`ALTER TABLE "user_experiences" DROP CONSTRAINT "FK_user_experiences_user"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_user_skills_user"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_user_profiles_user"`);
        
        await queryRunner.query(`DROP TABLE "ai_prompt_logs"`);
        await queryRunner.query(`DROP TABLE "cv_templates"`);
        await queryRunner.query(`DROP TABLE "cv_exports"`);
        await queryRunner.query(`DROP TABLE "cv_versions"`);
        await queryRunner.query(`DROP TABLE "cv_job_keywords"`);
        await queryRunner.query(`DROP TABLE "cvs"`);
        await queryRunner.query(`DROP TABLE "user_projects"`);
        await queryRunner.query(`DROP TABLE "user_education"`);
        await queryRunner.query(`DROP TABLE "user_experience_achievements"`);
        await queryRunner.query(`DROP TABLE "user_experiences"`);
        await queryRunner.query(`DROP TABLE "user_skills"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
