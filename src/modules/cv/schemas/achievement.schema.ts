import { z } from "zod";

export const AchievementSchema = z.object({
    id: z.number().optional(),
    work_experience_id: z.number().optional(),
    description: z.string().describe('Descripción del logro'),
    status: z.boolean().default(true).describe('Estado del logro').optional(),
}).required();

export type Achievement = z.infer<typeof AchievementSchema>;