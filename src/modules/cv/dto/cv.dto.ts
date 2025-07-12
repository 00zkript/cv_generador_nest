import { createZodDto } from "@anatine/zod-nestjs";
import { CvSchema } from "../schemas/cv.schema";

export class CvDto extends createZodDto(CvSchema) { }