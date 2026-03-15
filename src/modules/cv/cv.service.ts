import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Cv } from './entity/cv.entity';
import { CvJobKeyword } from './entity/cv-job-keyword.entity';
import { CvVersion } from './entity/cv-version.entity';
import { CreateFullCvDto } from './dto/cv.dto';

@Injectable()
export class CvService {
    private readonly relations = ['job_keywords', 'versions'];

    constructor(
        @InjectRepository(Cv)
        private cvRepository: Repository<Cv>,
        @InjectRepository(CvJobKeyword)
        private cvJobKeywordRepository: Repository<CvJobKeyword>,
        @InjectRepository(CvVersion)
        private cvVersionRepository: Repository<CvVersion>,
        private dataSource: DataSource,
    ) {}

    async getAll(userId?: number): Promise<Cv[]> {
        const where = userId ? { user_id: userId } : {};
        return this.cvRepository.find({
            where,
            relations: this.relations,
        });
    }

    async getById(id: number): Promise<Cv> {
        const cv = await this.cvRepository.findOne({
            where: { id },
            relations: this.relations,
        });

        if (!cv) {
            throw new NotFoundException(`CV con ID ${id} no encontrado`);
        }

        return cv;
    }

    async create(data: Partial<Cv>, userId: number): Promise<Cv> {
        const cv = this.cvRepository.create({
            ...data,
            user_id: userId,
        });
        return this.cvRepository.save(cv);
    }

    async createFullCv(data: CreateFullCvDto, userId: number): Promise<Cv> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const cv = this.cvRepository.create({
                ...data.cv,
                user_id: userId,
            });
            const savedCv = await queryRunner.manager.save(cv);

            if (data.job_keywords && data.job_keywords.length > 0) {
                const jobKeywords = data.job_keywords.map(kw => 
                    this.cvJobKeywordRepository.create({
                        cv_id: savedCv.id,
                        keyword: kw.keyword,
                        weight: kw.weight ?? 1,
                    })
                );
                await queryRunner.manager.save(jobKeywords);
            }

            if (data.version) {
                const versionCount = await this.cvVersionRepository.count({ where: { cv_id: savedCv.id } });
                const version = this.cvVersionRepository.create({
                    cv_id: savedCv.id,
                    version_number: versionCount + 1,
                    prompt_used: data.version.generated_with,
                    content_json: data.version.content ? JSON.parse(data.version.content) : {},
                });
                await queryRunner.manager.save(version);
            }

            await queryRunner.commitTransaction();
            return this.getById(savedCv.id);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, data: Partial<Cv>): Promise<Cv> {
        const cv = await this.getById(id);
        Object.assign(cv, data);
        return this.cvRepository.save(cv);
    }

    async delete(id: number): Promise<void> {
        const cv = await this.getById(id);
        await this.cvRepository.remove(cv);
    }

    async addJobKeyword(cvId: number, keyword: string, weight: number): Promise<CvJobKeyword> {
        const jobKeyword = new CvJobKeyword();
        jobKeyword.cv_id = cvId;
        jobKeyword.keyword = keyword;
        jobKeyword.weight = weight;
        return jobKeyword;
    }

    async createVersion(cvId: number, data: Partial<CvVersion>): Promise<CvVersion> {
        const version = new CvVersion();
        version.cv_id = cvId;
        Object.assign(version, data);
        return version;
    }

    private async startTransaction(): Promise<QueryRunner> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }
}
