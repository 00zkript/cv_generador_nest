
import { DataSource } from 'typeorm';
import { PersonalInfo } from './personal-info.entity';

export const personalInfoProviders = [
  {
    provide: 'PERSONAL_INFO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PersonalInfo),
    inject: ['DATA_SOURCE'],
  },
];
