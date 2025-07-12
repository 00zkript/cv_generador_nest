import { z } from "zod";

export const LanguageSchema = z.object({
    id: z.number().optional(),
    // cv_id: z.number().optional(),
    name: z.string().describe('Nombre del idioma'),
    nivel: z.string().describe('Nivel del idioma'),
    description: z.string().describe('Descripción del idioma'),
    status: z.boolean().default(true).describe('Estado del idioma').optional(),
}).required();

export type Language = z.infer<typeof LanguageSchema>;