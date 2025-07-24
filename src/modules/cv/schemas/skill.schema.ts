import { z } from "zod";

export const SkillSchema = z.object({
    id: z.number().optional(),
    // cv_id: z.number().optional(),
    name: z.string().describe('Nombre de la habilidad'),
    time_level: z.string().describe('Nivel de tiempo').optional(),
    description: z.string().describe('Descripción de la habilidad').optional(),
    status: z.boolean().default(true).describe('Estado de la habilidad').optional(),
}).required();

export type Skill = z.infer<typeof SkillSchema>;