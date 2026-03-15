import 'dotenv/config'
import { DataSource } from 'typeorm'
import { User } from '../modules/auth/entity/user.entity'
import { UserProfile } from '../modules/auth/entity/user-profile.entity'
import { UserSkill } from '../modules/auth/entity/user-skill.entity'
import { UserExperience } from '../modules/auth/entity/user-experience.entity'
import { UserEducation } from '../modules/auth/entity/user-education.entity'
import { UserProject } from '../modules/auth/entity/user-project.entity'
import { UserExperienceAchievement } from '../modules/auth/entity/user-experience-achievement.entity'
import { Cv } from '../modules/cv/entity/cv.entity'
import { CvJobKeyword } from '../modules/cv/entity/cv-job-keyword.entity'
import { CvVersion } from '../modules/cv/entity/cv-version.entity'
import { CvExport } from '../modules/cv/entity/cv-export.entity'
import { CvTemplate } from '../modules/cv/entity/cv-template.entity'
import { AiPromptLog } from '../modules/cv/entity/ai-prompt-log.entity'

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        User,
        UserProfile,
        UserSkill,
        UserExperience,
        UserEducation,
        UserProject,
        UserExperienceAchievement,
        Cv,
        CvJobKeyword,
        CvVersion,
        CvExport,
        CvTemplate,
        AiPromptLog,
    ],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
})