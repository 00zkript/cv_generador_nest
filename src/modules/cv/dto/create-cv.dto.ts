import { createZodDto } from "@anatine/zod-nestjs";
import { CreateCvSchema } from "../schemas/create-cv.chema";

export class CreateCvDto extends createZodDto(CreateCvSchema) { }