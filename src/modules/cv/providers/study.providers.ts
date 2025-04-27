import { DataSource } from 'typeorm';
import { Study } from '../entity/study.entity';

export const studyProviders = [
    {
        provide: 'STUDY_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Study),
        inject: ['DATA_SOURCE'],
    },
];