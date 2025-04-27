import { Injectable, NotFoundException, Inject, UsePipes, Body } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Cv } from './entity/cv.entity';
import { Contact } from './entity/contact.entity';
import { WorkExperience } from './entity/work-experience.entity';
import { Achievement } from './entity/achievement.entity';
import { Skill } from './entity/skill.entity';
import { Study } from './entity/study.entity';
import { Language } from './entity/language.entity';
import { RequestCvDto, WorkExperienceDto } from './schemas/cv.schema';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Injectable()
@UsePipes(ZodValidationPipe)
export class CvService {
    private readonly relations = [
        'contact',
        'skills',
        'studies',
        'languages',
        'works_experiences',
        'works_experiences.achievements'
    ];

    constructor(
        @Inject('CV_REPOSITORY')
        private cvRepository: Repository<Cv>,
        @Inject('DATA_SOURCE')
        private dataSource: DataSource,

    ) { }

    async getCvs(): Promise<Cv[]> {
        return this.cvRepository.find({
            where: { status: true },
            relations: this.relations
        });
    }

    async getCv(id: number): Promise<Cv> {
        const cv = await this.cvRepository.findOne({
            where: { id },
            relations: this.relations
        });
        if (!cv) {
            throw new NotFoundException(`CV con ID ${id} no encontrado`);
        }
        return cv;
    }

    async storeCv(request: RequestCvDto): Promise<Cv> {
        const queryRunner = await this.startTransaction();
        try {

            const cv = queryRunner.manager.create(Cv, request.cv);

            if (request.contact) {
                cv.contact = queryRunner.manager.create(Contact, request.contact);
            }

            if (request.works_experiences?.length) {
                cv.works_experiences = request.works_experiences.map(workExperience => {
                    const work = queryRunner.manager.create(WorkExperience, {
                        ...workExperience,
                        achievements: workExperience.achievements?.map(achievement =>
                            queryRunner.manager.create(Achievement, achievement)
                        ) || []
                    });
                    return work;
                });
            }

            if (request.skills?.length) {
                cv.skills = request.skills.map(skill =>
                    queryRunner.manager.create(Skill, skill)
                );
            }

            if (request.studies?.length) {
                cv.studies = request.studies.map(study =>
                    queryRunner.manager.create(Study, study)
                );
            }

            if (request.languages?.length) {
                cv.languages = request.languages.map(language =>
                    queryRunner.manager.create(Language, language)
                );
            }


            const savedCv = await queryRunner.manager.save(Cv, cv);

            await queryRunner.commitTransaction();
            return savedCv;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new Error(`Error al crear CV: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            await queryRunner.release();
        }
    }

    async updateCv(id: number, request: RequestCvDto): Promise<Cv> {
        const queryRunner = await this.startTransaction();

        try {
            const existingCv = await this.findCvById(queryRunner, id);

            Object.assign(existingCv, request.cv);


            if (request.contact) {
                existingCv.contact = existingCv.contact
                    ? queryRunner.manager.merge(Contact, existingCv.contact, request.contact)
                    : queryRunner.manager.create(Contact, request.contact);
            }

            if (request.works_experiences?.length) {
                existingCv.works_experiences = request.works_experiences.map(workExpDto => {
                    const workExperience = queryRunner.manager.create(WorkExperience, workExpDto);

                    if (workExpDto.achievements) {
                        workExperience.achievements = workExpDto.achievements.map(achievementDto =>
                            queryRunner.manager.create(Achievement, achievementDto)
                        );
                    }

                    return workExperience;
                });
            }

            if (request.skills?.length) {
                existingCv.skills = request.skills.map(skill =>
                    queryRunner.manager.create(Skill, skill)
                );
            }

            if (request.studies?.length) {
                existingCv.studies = request.studies.map(study =>
                    queryRunner.manager.create(Study, study)
                );
            }

            if (request.languages?.length) {
                existingCv.languages = request.languages.map(language =>
                    queryRunner.manager.create(Language, language)
                );
            }

            const updatedCv = await queryRunner.manager.save(Cv, existingCv);

            await queryRunner.commitTransaction();
            return updatedCv;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new Error(`Error al actualizar CV: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            await queryRunner.release();
        }
    }

    async deleteCv(id: number): Promise<void> {
        const queryRunner = await this.startTransaction();

        try {
            const cv = await this.findCvById(queryRunner, id);
            await queryRunner.manager.remove(cv);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Error al eliminar CV: ${(error instanceof Error) ? error.message : error}`);
        } finally {
            await queryRunner.release();
        }
    }

    async duplicateCv(id: number): Promise<Cv> {
        const queryRunner = await this.startTransaction();

        try {
            const originalCv = await this.findCvById(queryRunner, id);

            const newCv = queryRunner.manager.create(Cv, {
                ...originalCv,
                id: undefined,
                name: `${originalCv.name} - Copia`,
            })

            if (originalCv.contact) {
                newCv.contact = queryRunner.manager.create(Contact, {
                    ...originalCv.contact,
                    id: undefined,
                });
            }

            if (originalCv.works_experiences?.length) {
                newCv.works_experiences = originalCv.works_experiences.map(workExperience => {
                    const newWork = queryRunner.manager.create(WorkExperience, {
                        ...workExperience,
                        id: undefined,
                    });

                    if (workExperience.achievements?.length) {
                        newWork.achievements = workExperience.achievements.map(achievement =>
                            queryRunner.manager.create(Achievement, {
                                ...achievement,
                                id: undefined,
                            })
                        );
                    }

                    return newWork;
                });
            }

            if (originalCv.skills?.length) {
                newCv.skills = originalCv.skills.map(skill =>
                    queryRunner.manager.create(Skill, {
                        ...skill,
                        id: undefined,
                    })
                );
            }

            if (originalCv.studies?.length) {
                newCv.studies = originalCv.studies.map(study =>
                    queryRunner.manager.create(Study, {
                        ...study,
                        id: undefined,
                    })
                );
            }

            if (originalCv.languages?.length) {
                newCv.languages = originalCv.languages.map(language =>
                    queryRunner.manager.create(Language, {
                        ...language,
                        id: undefined,
                    })
                );
            }

            const savedCv = await queryRunner.manager.save(Cv, newCv);

            await queryRunner.commitTransaction();
            return savedCv;
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new Error(`Error al crear CV: ${error instanceof Error ? error.message : String(error)}`);
        }
        finally {
            await queryRunner.release();
        }
    }

    async getPdf(id: number) {
    }

    private async startTransaction(): Promise<QueryRunner> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        return queryRunner;
    }

    private async findCvById(queryRunner: QueryRunner, id: number): Promise<Cv> {
        const cv = await queryRunner.manager.findOne(Cv, {
            where: { id },
            relations: this.relations,
        });

        if (!cv) {
            throw new NotFoundException(`CV con ID ${id} no encontrado`);
        }
        return cv;
    }


}