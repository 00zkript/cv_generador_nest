import { DataSource } from 'typeorm';
import { Reference } from './reference.entity';

export const referencesProviders = [
  {
    provide: 'REFERENCES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Reference),
    inject: ['DATA_SOURCE'],
  },
];