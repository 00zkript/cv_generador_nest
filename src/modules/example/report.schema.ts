// date.schema.ts
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

// Esquema para validar la fecha de entrada
export const ReportRequestSchema = z
  .object({
    date_start: z.string().date().describe('Fecha de entrada'),
    date_end: z.string().date().describe('Fecha de salida')
  })
  .required()
  .strict();

// Esquema para la respuesta con fecha procesada
export const ReportResponseSchema = z.object({
  message: z.string().describe('Mensaje de saludo'),
  dateStart: z.string().describe('Fecha de entrada'),
  dateEnd: z.string().describe('Fecha de salida'),
})
.required()
.strict();;

// DTOs generados automáticamente para Swagger
// export type ReportRequestDto = z.infer<typeof ReportRequestSchema>;
// export type ReportResponseDto = z.infer<typeof ReportResponseSchema>;

export class ReportRequestDto extends createZodDto(ReportRequestSchema) {}
export class ReportResponseDto extends createZodDto(ReportResponseSchema) {}