import { DataSource } from 'typeorm';
import { WorkExperience } from '../entity/work-experience.entity';

export const workExperienceProviders = [
    {
        provide: 'WORK_EXPERIENCE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(WorkExperience),
        inject: ['DATA_SOURCE'],
    },
];