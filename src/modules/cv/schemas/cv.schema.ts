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

// Tipos inferidos de los esquemas
export type Cv = z.infer<typeof CvSchema>;

