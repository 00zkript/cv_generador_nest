import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class CustomZodValidationPipe<T> implements PipeTransform {
    constructor(private readonly schema: ZodSchema<T>) {}

    transform(value: unknown): T {
        const result = this.schema.safeParse(value);
        if (!result.success) {
            throw new BadRequestException(result.error);
        }
        return result.data;
    }
}
