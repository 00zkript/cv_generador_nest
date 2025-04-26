import { Module } from '@nestjs/common';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { educationProviders } from './education.providers';

@Module({
    controllers: [EducationController],
    providers: [
        ...educationProviders,
        EducationService
    ],
    exports: [EducationService]
})
export class EducationModule {}