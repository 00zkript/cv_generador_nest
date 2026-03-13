import dataSource from '@/data-source';

export const databaseProviders = [
    {
        provide: 'CONNECTION',
        useFactory: async () => {
            if (!dataSource.isInitialized) {
                await dataSource.initialize();
            }

            return dataSource;
        },
    },
];