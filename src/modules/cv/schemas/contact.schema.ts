import { z } from "zod";

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

export type Contact = z.infer<typeof ContactSchema>;