import { createZodDto } from "@anatine/zod-nestjs";
import { CvSchema } from "../schemas/cv.schema";

export class ResponseCvDto extends createZodDto(CvSchema) { }