import { Module } from '@nestjs/common';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';
import { referencesProviders } from './references.providers';

@Module({
    controllers: [ReferencesController],
    providers: [
        ...referencesProviders,
        ReferencesService
    ],
    exports: [ReferencesService]
})
export class ReferencesModule {}