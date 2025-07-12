import { z } from "zod";

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

export type Study = z.infer<typeof StudySchema>;