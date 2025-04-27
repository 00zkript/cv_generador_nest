import { DataSource } from 'typeorm';
import { Achievement } from '../entity/achievement.entity';

export const achievementProviders = [
    {
        provide: 'ACHIEVEMENT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Achievement),
        inject: ['DATA_SOURCE'],
    },
];