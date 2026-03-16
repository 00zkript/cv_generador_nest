import { Injectable, NotFoundException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Cv } from './entity/cv.entity';
import { CvJobKeyword } from './entity/cv-job-keyword.entity';
import { CvVersion } from './entity/cv-version.entity';
import { CreateFullCvDto } from './dto/cv.dto';
import { GenerateCvDto } from './dto/generate-cv.dto';
import { PageOptionsDto, PaginateDto } from '../../dtos/paginate.dto';
import { AiService, UserData, GeneratedCvData } from '../ai/ai.service';
import { UsersService } from '../auth/users.service';

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
        private aiService: AiService,
        private usersService: UsersService,
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
            order: { 
                created_at: 'DESC',
                job_keywords: { position: 'ASC' },
                versions: { position: 'ASC' },
            },
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
            order: {
                job_keywords: { position: 'ASC' },
                versions: { position: 'ASC' },
            },
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
                const jobKeywords = data.job_keywords.map((kw, index) => 
                    this.cvJobKeywordRepository.create({
                        cv_id: savedCv.id,
                        keyword: kw.keyword,
                        weight: kw.weight ?? 1,
                        position: index,
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
                    position: versionCount,
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
        const count = await this.cvJobKeywordRepository.count({ where: { cv_id: cvId } });
        const jobKeyword = new CvJobKeyword();
        jobKeyword.cv_id = cvId;
        jobKeyword.keyword = keyword;
        jobKeyword.weight = weight;
        jobKeyword.position = count;
        return this.cvJobKeywordRepository.save(jobKeyword);
    }

    async createVersion(cvId: number, data: Partial<CvVersion>): Promise<CvVersion> {
        const count = await this.cvVersionRepository.count({ where: { cv_id: cvId } });
        const version = new CvVersion();
        version.cv_id = cvId;
        version.position = count;
        Object.assign(version, data);
        return this.cvVersionRepository.save(version);
    }

    async generateCvWithAi(data: GenerateCvDto, userId: number) {
        this.logger.log({
            message: 'Iniciando generación de CV con IA',
            userId,
            targetRole: data.target_role,
            targetCompany: data.target_company,
        });

        if (!userId || userId <= 0) {
            throw new HttpException('ID de usuario inválido', HttpStatus.BAD_REQUEST);
        }

        const user = await this.usersService.getUserData(userId);
        if (!user) {
            this.logger.warn({ message: 'Usuario no encontrado', userId });
            throw new NotFoundException('Usuario no encontrado');
        }

        const hasProfileData = user.profile || (user.skills && user.skills.length > 0) || (user.experiences && user.experiences.length > 0);
        
        if (!hasProfileData) {
            this.logger.warn({
                message: 'El usuario no tiene datos suficientes para generar un CV',
                userId,
                hasProfile: !!user.profile,
                skillsCount: user.skills?.length ?? 0,
                experiencesCount: user.experiences?.length ?? 0,
            });
            throw new HttpException(
                'No tienes suficientes datos en tu perfil. Completa tu información personal, skills y experiencias primero.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const userData: UserData = {
            name: user.name || '',
            profile: user.profile ? {
                headline: user.profile.headline,
                about: user.profile.about,
                phone: user.profile.phone,
                location: user.profile.location,
                linkedin_url: user.profile.linkedin_url,
                github_url: user.profile.github_url,
                portfolio_url: user.profile.portfolio_url,
            } : {},
            skills: user.skills || [],
            experiences: (user.experiences || []).map(exp => ({
                company: exp.company,
                role: exp.role,
                start_date: exp.start_date,
                end_date: exp.end_date,
                is_current: exp.is_current,
                description: exp.description,
            })),
            education: user.education || [],
            projects: user.projects || [],
        };

        let generatedCv: GeneratedCvData;
        
        try {
            generatedCv = await this.aiService.generateCvWithDeepSeek(userData, {
                target_role: data.target_role,
                target_company: data.target_company,
                job_description: data.job_description,
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            this.logger.error({
                message: 'Error al generar CV con IA',
                error: error instanceof Error ? error.message : 'Error desconocido',
                userId,
            });
            throw new HttpException(
                'Error al generar el CV con IA. Por favor, intente de nuevo.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const cv = this.cvRepository.create({
                title: data.title || `${data.target_role} - ${data.target_company}`,
                target_role: data.target_role,
                target_company: data.target_company,
                job_description: data.job_description,
                user_id: userId,
            });
            const savedCv = await queryRunner.manager.save(cv);

            if (generatedCv.keywords && generatedCv.keywords.length > 0) {
                const jobKeywords = generatedCv.keywords.map((keyword, index) =>
                    this.cvJobKeywordRepository.create({
                        cv_id: savedCv.id,
                        keyword: keyword,
                        weight: 1,
                        position: index,
                    })
                );
                await queryRunner.manager.save(jobKeywords);
            }

            const versionCount = await this.cvVersionRepository.count({ where: { cv_id: savedCv.id } });
            const version = this.cvVersionRepository.create({
                cv_id: savedCv.id,
                version_number: versionCount + 1,
                position: versionCount,
                prompt_used: 'deepseek-chat',
                content_json: generatedCv as unknown as Record<string, unknown>,
                ats_score: (generatedCv.ats_optimized_content as { ats_score_estimate?: number })?.ats_score_estimate || 0,
            });
            await queryRunner.manager.save(version);

            await queryRunner.commitTransaction();
            
            this.logger.log({
                message: 'CV generado exitosamente con IA',
                cvId: savedCv.id,
                versionId: version.id,
                userId,
            });

            return {
                cv_id: savedCv.id,
                version_id: version.id,
                target_role: savedCv.target_role,
                target_company: savedCv.target_company,
                generated_data: generatedCv,
                created_at: savedCv.created_at,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error({
                message: 'Error al guardar CV en la base de datos',
                error: error instanceof Error ? error.message : 'Error desconocido',
                userId,
            });
            throw new HttpException(
                'Error al guardar el CV. Por favor, intente de nuevo.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        } finally {
            await queryRunner.release();
        }
    }

    private async startTransaction(): Promise<QueryRunner> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async addVersion(cvId: number, contentJson: Record<string, unknown>): Promise<CvVersion> {
        const versionCount = await this.cvVersionRepository.count({ where: { cv_id: cvId } });
        const version = this.cvVersionRepository.create({
            cv_id: cvId,
            version_number: versionCount + 1,
            position: versionCount,
            prompt_used: 'manual',
            content_json: contentJson,
        });
        return this.cvVersionRepository.save(version);
    }
}
