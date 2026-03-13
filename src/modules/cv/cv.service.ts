import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Cv } from './entity/cv.entity';
import { CvJobKeyword } from './entity/cv-job-keyword.entity';
import { CvVersion } from './entity/cv-version.entity';

@Injectable()
export class CvService {
    private readonly relations = ['job_keywords', 'versions'];

    constructor(
        @Inject('CONNECTION')
        private cvRepository: Repository<Cv>,
        @Inject('CONNECTION')
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
