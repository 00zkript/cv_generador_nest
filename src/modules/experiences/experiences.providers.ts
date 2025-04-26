import { DataSource } from 'typeorm';
import { Experience } from './experience.entity';

export const experiencesProviders = [
  {
    provide: 'EXPERIENCES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Experience),
    inject: ['DATA_SOURCE'],
  },
];