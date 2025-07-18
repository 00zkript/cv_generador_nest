import { z } from "zod";
import { AchievementSchema } from "./achievement.schema";

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
    achievements: z.string().describe('Descripción de los logros').optional(),
    status: z.boolean().default(true).describe('Estado del trabajo').optional(),
    // achievements: z.array(AchievementSchema.omit({ id: true })).describe('Logros en el trabajo')
}).required();

export type WorkExperience = z.infer<typeof WorkExperienceSchema>;