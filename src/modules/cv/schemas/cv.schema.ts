import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

// Esquema para el CV básico
export const CvSchema = z.object({
    id: z.number().optional(),
    name: z.string().describe('Nombre del CV'),
    subject: z.string().describe('Asunto del CV'),
    version: z.string().default('1.0.0').describe('Versión del CV'),
    resume: z.string().describe('Resumen del CV'),
    language: z.string().default('esp').describe('Idioma del CV'),
    status: z.boolean().default(true).describe('Estado del CV').optional(),
    // created_at: z.string().datetime().optional(),
    // updated_at: z.string().datetime().optional(),
}).required();

// Esquema para el contacto
export const ContactSchema = z.object({
    id: z.number().optional(),
    // cv_id: z.number().optional(),
    name: z.string().describe('Nombres'),
    last_name: z.string().describe('Apellidos'),
    phone: z.string().describe('Número de teléfono'),
    email: z.string().email().optional().describe('Correo electrónico'),
    linkedin: z.string().describe('Perfil de LinkedIn'),
    github: z.string().describe('Perfil de GitHub'),
    portafolio: z.string().describe('Perfil de Portafolio'),
    city: z.string().describe('Ciudad'),
    country: z.string().describe('País'),
    status: z.boolean().default(true).describe('Estado del contacto').optional(),
    // created_at: z.string().datetime().optional(),
    // updated_at: z.string().datetime().optional(),
}).required();

// Esquema para logros
export const AchievementSchema = z.object({
    id: z.number().optional(),
    work_experience_id: z.number().optional(),
    description: z.string().describe('Descripción del logro'),
    status: z.boolean().default(true).describe('Estado del logro').optional(),
}).required();

// Esquema para experiencia laboral
export const WorkExperienceSchema = z.object({
    id: z.number().optional(),
    // cv_id: z.number().optional(),
    name: z.string().describe('Nombre del trabajo'),
    company: z.string().describe('Nombre de la empresa'),
    position: z.string().describe('Cargo'),
    start_date: z.string().describe('Fecha de inicio'),
    end_date: z.string().optional().describe('Fecha de finalización'),
    current: z.boolean().default(false).describe('En curso'),
    description: z.string().describe('Descripción del trabajo'),
    city: z.string().describe('Ciudad'),
    country: z.string().describe('País'),
    status: z.boolean().default(true).describe('Estado del trabajo').optional(),
    achievements: z.array(AchievementSchema.omit({ id: true })).describe('Logros en el trabajo')
}).required();

// Esquema para habilidades
export const SkillSchema = z.object({
    id: z.number().optional(),
    // cv_id: z.number().optional(),
    name: z.string().describe('Nombre de la habilidad'),
    time_level: z.string().describe('Nivel de tiempo'),
    description: z.string().describe('Descripción de la habilidad'),
    status: z.boolean().default(true).describe('Estado de la habilidad').optional(),
}).required();

// Esquema para estudios
export const StudySchema = z.object({
    id: z.number().optional(),
    // cv_id: z.number().optional(),
    center_study: z.string().describe('Centro de estudio'),
    title: z.string().describe('Título del estudio'),
    start_date: z.string().describe('Fecha de inicio'),
    end_date: z.string().optional().describe('Fecha de finalización'),
    description: z.string().describe('Descripción del estudio'),
    city: z.string().describe('Ciudad'),
    country: z.string().describe('País'),
    current: z.boolean().default(false).describe('En curso'),
    status: z.boolean().default(true).describe('Estado del estudio').optional(),
}).required();

// Esquema para idiomas
export const LanguageSchema = z.object({
    id: z.number().optional(),
    // cv_id: z.number().optional(),
    name: z.string().describe('Nombre del idioma'),
    nivel: z.string().describe('Nivel del idioma'),
    description: z.string().describe('Descripción del idioma'),
    status: z.boolean().default(true).describe('Estado del idioma').optional(),
}).required();

// Esquema completo para CV con detalles
export const RequestCvSchema = z.object({
    cv: CvSchema.omit({ id: true }),
    contact: ContactSchema.omit({ id: true }),
    works_experiences: z.array(WorkExperienceSchema.omit({ id: true })),
    skills: z.array(SkillSchema.omit({ id: true })),
    studies: z.array(StudySchema.omit({ id: true })),
    languages: z.array(LanguageSchema.omit({ id: true }))
}).required();

// Tipos inferidos de los esquemas
export type Cv = z.infer<typeof CvSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Study = z.infer<typeof StudySchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type RequestCv = z.infer<typeof RequestCvSchema>;

// DTOs generados usando @anatine/zod-nestjs
export class CvDto extends createZodDto(CvSchema) { }
export class ContactDto extends createZodDto(ContactSchema) { }
export class AchievementDto extends createZodDto(AchievementSchema) { }
export class WorkExperienceDto extends createZodDto(WorkExperienceSchema) { }
export class SkillDto extends createZodDto(SkillSchema) { }
export class StudyDto extends createZodDto(StudySchema) { }
export class LanguageDto extends createZodDto(LanguageSchema) { }

export class RequestCvDto extends createZodDto(RequestCvSchema) { }