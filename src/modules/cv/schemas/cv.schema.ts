import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

// Esquema para el CV básico
export const CvSchema = z.object({
    id: z.number().optional(),
    title: z.string().describe('Título del CV'),
    description: z.string().describe('Descripción del CV'),
    status: z.boolean().default(true).describe('Estado del CV')
}).required();

// Esquema para el contacto
export const ContactSchema = z.object({
    id: z.number().optional(),
    name: z.string().describe('Nombre completo'),
    email: z.string().email().describe('Correo electrónico'),
    phone: z.string().describe('Número de teléfono'),
    address: z.string().describe('Dirección'),
    linkedin: z.string().optional().describe('Perfil de LinkedIn'),
    github: z.string().optional().describe('Perfil de GitHub')
}).required();

// Esquema para logros
export const AchievementSchema = z.object({
    id: z.number().optional(),
    description: z.string().describe('Descripción del logro')
}).required();

// Esquema para experiencia laboral
export const WorkExperienceSchema = z.object({
    id: z.number().optional(),
    company: z.string().describe('Nombre de la empresa'),
    position: z.string().describe('Cargo o posición'),
    start_date: z.string().describe('Fecha de inicio'),
    end_date: z.string().optional().describe('Fecha de finalización'),
    current: z.boolean().default(false).describe('Trabajo actual'),
    description: z.string().describe('Descripción del trabajo'),
    achievements: z.array(AchievementSchema.omit({ id: true })).describe('Logros en el trabajo')
}).required();

// Esquema para habilidades
export const SkillSchema = z.object({
    id: z.number().optional(),
    name: z.string().describe('Nombre de la habilidad'),
    level: z.number().min(1).max(5).describe('Nivel de la habilidad (1-5)')
}).required();

// Esquema para estudios
export const StudySchema = z.object({
    id: z.number().optional(),
    institution: z.string().describe('Nombre de la institución'),
    degree: z.string().describe('Título obtenido'),
    field: z.string().describe('Campo de estudio'),
    start_date: z.string().describe('Fecha de inicio'),
    end_date: z.string().optional().describe('Fecha de finalización'),
    current: z.boolean().default(false).describe('En curso')
}).required();

// Esquema para idiomas
export const LanguageSchema = z.object({
    id: z.number().optional(),
    name: z.string().describe('Nombre del idioma'),
    level: z.string().describe('Nivel del idioma')
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