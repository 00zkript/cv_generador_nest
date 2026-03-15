import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { DataSourceOptions } from 'typeorm'
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

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {

                const config: DataSourceOptions = {
                    type: configService.getOrThrow<'postgres'>('database.postgres.type'),
                    host: configService.getOrThrow<string>('database.postgres.host'),
                    port: configService.getOrThrow<number>('database.postgres.port'),
                    username: configService.getOrThrow<string>('database.postgres.username'),
                    password: configService.getOrThrow<string>('database.postgres.password'),
                    database: configService.getOrThrow<string>('database.postgres.database'),
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
                    synchronize: configService.getOrThrow<boolean>('database.postgres.synchronize'),
                    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
                    logging: false,
                }

                return config
            },
        }),
    ],
})
export class DatabaseModule {}