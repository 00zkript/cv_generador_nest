import { z } from "zod";
import { CvSchema } from "./cv.schema";
import { ContactSchema } from "./contact.schema";
import { WorkExperienceSchema } from "./work-experience.schema";
import { SkillSchema } from "./skill.schema";
import { StudySchema } from "./study.schema";
import { LanguageSchema } from "./language.schema";

export const CreateCvSchema = z.object({
    cv: CvSchema.omit({ id: true }),
    contact: ContactSchema.omit({ id: true }),
    works_experiences: z.array(WorkExperienceSchema.omit({ id: true })),
    skills: z.array(SkillSchema.omit({ id: true })),
    studies: z.array(StudySchema.omit({ id: true })),
    languages: z.array(LanguageSchema.omit({ id: true }))
}).required();
