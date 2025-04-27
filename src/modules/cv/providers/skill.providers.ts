import { DataSource } from 'typeorm';
import { Skill } from '../entity/skill.entity';

export const skillProviders = [
    {
        provide: 'SKILL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Skill),
        inject: ['DATA_SOURCE'],
    },
];