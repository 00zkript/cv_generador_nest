import { Injectable, NotFoundException, Inject, UsePipes, Body } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Cv } from './entity/cv.entity';
import { Contact } from './entity/contact.entity';
import { WorkExperience } from './entity/work-experience.entity';
import { Achievement } from './entity/achievement.entity';
import { Skill } from './entity/skill.entity';
import { Study } from './entity/study.entity';
import { Language } from './entity/language.entity';
import { RequestCvDto } from './schemas/cv.schema';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { readFile } from 'fs/promises';




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
            relations: this.relations,
        });
    }

    async getCv(id: number): Promise<Cv> {
        const cv = await this.cvRepository.findOne({
            where: { id },
            relations: this.relations,
            order: {
                works_experiences: {
                    id: 'DESC'
                },
                studies: {
                    id: 'ASC'
                }
            }
        });
        if (!cv) {
            throw new NotFoundException(`CV con ID ${id} no encontrado`);
        }

        cv.works_experiences.sort((a, b) => a.id - b.id);
        cv.skills.sort((a, b) => a.name.localeCompare(b.name));
        cv.studies.sort((a, b) => a.id - b.id);

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
                if (existingCv.contact) {
                    // Actualizar contacto existente preservando id y fechas
                    Object.assign(existingCv.contact, {
                        ...request.contact,
                        created_at: existingCv.contact.created_at,
                        updated_at: new Date(),
                    });
                } else {
                    // Crear nuevo contacto
                    existingCv.contact = queryRunner.manager.create(Contact, {
                        ...request.contact
                    });
                }
            }

            if (request.works_experiences?.length) {
                await queryRunner.manager.remove(existingCv.works_experiences);
                existingCv.works_experiences = request.works_experiences.map(workExpDto => {
                    const workExperience = queryRunner.manager.create(WorkExperience, { ...workExpDto });

                    if (workExpDto.achievements) {
                        workExperience.achievements = workExpDto.achievements.map(achievementDto =>
                            queryRunner.manager.create(Achievement, achievementDto)
                        );
                    }

                    return workExperience;
                });
            }

            if (request.skills?.length) {
                await queryRunner.manager.remove(existingCv.skills);
                existingCv.skills = request.skills.map(skill =>
                    queryRunner.manager.create(Skill, { ...skill })
                );
            }

            if (request.studies?.length) {
                await queryRunner.manager.remove(existingCv.studies);
                existingCv.studies = request.studies.map(study =>
                    queryRunner.manager.create(Study, { ...study })
                );
            }

            if (request.languages?.length) {
                await queryRunner.manager.remove(existingCv.languages);
                existingCv.languages = request.languages.map(language =>
                    queryRunner.manager.create(Language, { ...language })
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
            await queryRunner.manager.remove(cv.works_experiences);
            await queryRunner.manager.remove(cv.skills);
            await queryRunner.manager.remove(cv.studies);
            await queryRunner.manager.remove(cv.languages);
            await queryRunner.manager.remove(cv.contact);

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
        try {
            const cv = await this.getCv(id);

            // Registrar helpers de Handlebars
            Handlebars.registerHelper('breaklines', function (text: string) {
                // text = Handlebars.Utils.escapeExpression(text);
                text = text.replace(/([\r\n])/g, '<br>').trim();
                // return new Handlebars.SafeString(text);
                return text
            });

            Handlebars.registerHelper('monthYear', function (date) {
                const months = [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];
                const d = new Date(date);
                return `${months[d.getMonth()]} ${d.getFullYear()}`;
            });

            const htmlTemplate = await readFile('src/templates/cv_template.html', 'utf-8');

            type langsType = Record<string, Record<string, string>>;
            const langs: langsType = {
                'esp': {
                    'section_skills_title': 'HABILIDADES',
                    'section_works_experiences_title': 'EXPERIENCIA PROFESIONAL',
                    'section_studies_title': 'EDUCACIÓN',
                    'section_studies_note': 'Nota',
                    'current': 'Presente',
                    'achievements': 'Logros',
                },
                'eng': {
                    'section_skills_title': 'SKILLS',
                    'section_works_experiences_title': 'WORK EXPERIENCE',
                    'section_studies_title': 'EDUCATION',
                    'section_studies_note': 'Note',
                    'current': 'Present',
                    'achievements': 'Achievements',
                },
            }

            const lang = langs[cv.language] ? langs[cv.language] : langs['esp'];

            // Compilar el HTML con Handlebars
            const template = Handlebars.compile(htmlTemplate);
            const htmlContent = template({
                cv,
                contact: cv.contact,
                experiences: cv.works_experiences.sort((a, b) => a.id - b.id),
                skills: cv.skills.sort((a, b) => a.name.localeCompare(b.name)),
                studies: cv.studies.sort((a, b) => a.id - b.id),
                languages: cv.languages,
                lang
            });

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                // margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
            });
            await browser.close();
            return pdfBuffer;
        } catch (error) {
            throw new Error(`Error al generar PDF: ${error instanceof Error ? error.message : String(error)}`);
        }

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