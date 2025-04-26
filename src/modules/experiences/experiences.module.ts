import { Module } from '@nestjs/common';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';
import { experiencesProviders } from './experiences.providers';

@Module({
    controllers: [ExperiencesController],
    providers: [
        ...experiencesProviders,
        ExperiencesService
    ],
    exports: [ExperiencesService]
})
export class ExperiencesModule {}