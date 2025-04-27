import { DataSource } from 'typeorm';
import { Cv } from '../entity/cv.entity';

export const cvProviders = [
    {
        provide: 'CV_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Cv),
        inject: ['DATA_SOURCE'],
    },
];