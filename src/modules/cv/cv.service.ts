import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Cv } from './entity/cv.entity';
import { CvJobKeyword } from './entity/cv-job-keyword.entity';
import { CvVersion } from './entity/cv-version.entity';
import { CreateFullCvDto } from './dto/cv.dto';
import { PageOptionsDto, PaginateDto } from '../../dtos/paginate.dto';

@Injectable()
export class CvService {
    private readonly logger = new Logger(CvService.name);
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

    async getAll(userId?: number, pageOptions?: PageOptionsDto): Promise<PaginateDto<Cv>> {
        this.logger.debug(`Obteniendo CVs paginados, userId: ${userId}, page: ${pageOptions?.page}, limit: ${pageOptions?.limit}`);
        
        const page = pageOptions?.page ?? 1;
        const limit = pageOptions?.limit ?? 10;
        
        const where = userId ? { user_id: userId } : {};
        
        const [cvs, total] = await this.cvRepository.findAndCount({
            where,
            relations: this.relations,
            take: limit,
            skip: (page - 1) * limit,
            order: { created_at: 'DESC' },
        });

        const totalPages = Math.ceil(total / limit);
        
        return {
            total,
            per_page: limit,
            current_page: page,
            last_page: totalPages,
            total_pages: totalPages,
            from: total > 0 ? (page - 1) * limit + 1 : 0,
            to: Math.min(page * limit, total),
            data: cvs,
        };
    }

    async getById(id: number): Promise<Cv> {
        this.logger.debug(`Obteniendo CV con ID: ${id}`);
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
        this.logger.debug(`Creando CV para usuario: ${userId}`);
        const cv = this.cvRepository.create({
            ...data,
            user_id: userId,
        });
        return this.cvRepository.save(cv);
    }

    async createFullCv(data: CreateFullCvDto, userId: number): Promise<Cv> {
        this.logger.debug(`Creando CV completo para usuario: ${userId}`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const cv = this.cvRepository.create({
                ...data.cv,
                user_id: userId,
            });
            const savedCv = await queryRunner.manager.save(cv);
            this.logger.debug(`CV creado con ID: ${savedCv.id}`);

            if (data.job_keywords && data.job_keywords.length > 0) {
                const jobKeywords = data.job_keywords.map(kw => 
                    this.cvJobKeywordRepository.create({
                        cv_id: savedCv.id,
                        keyword: kw.keyword,
                        weight: kw.weight ?? 1,
                    })
                );
                await queryRunner.manager.save(jobKeywords);
                this.logger.debug(`Agregados ${data.job_keywords.length} job keywords`);
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
                this.logger.debug(`Creada versión ${versionCount + 1} del CV`);
            }

            await queryRunner.commitTransaction();
            this.logger.log(`CV ${savedCv.id} creado exitosamente`);
            return this.getById(savedCv.id);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Error al crear CV: ${error.message}`);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, data: Partial<Cv>): Promise<Cv> {
        this.logger.debug(`Actualizando CV con ID: ${id}`);
        const cv = await this.getById(id);
        Object.assign(cv, data);
        return this.cvRepository.save(cv);
    }

    async delete(id: number): Promise<void> {
        this.logger.debug(`Eliminando CV con ID: ${id}`);
        const cv = await this.getById(id);
        await this.cvRepository.remove(cv);
        this.logger.log(`CV ${id} eliminado`);
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
