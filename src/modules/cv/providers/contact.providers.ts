
import { DataSource } from 'typeorm';
import { Contact } from '../entity/contact.entity';

export const contactProviders = [
    {
        provide: 'CONTACT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Contact),
        inject: ['DATA_SOURCE'],
    },
];
