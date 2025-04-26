// hello.schema.ts
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

// Define el esquema una sola vez
export const HelloResponseSchema = z.object({
  hello: z.string().describe('Mensaje de saludo')
});

// Genera DTO automáticamente para Swagger
export class HelloResponseDto extends createZodDto(HelloResponseSchema) {}