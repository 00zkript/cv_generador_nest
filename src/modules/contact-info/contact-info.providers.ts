import { DataSource } from 'typeorm';
import { ContactInfo } from './contact-info.entity';

export const contactInfoProviders = [
  {
    provide: 'CONTACT_INFO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ContactInfo),
    inject: ['DATA_SOURCE'],
  },
];