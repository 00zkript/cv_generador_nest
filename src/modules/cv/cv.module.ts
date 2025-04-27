import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { cvProviders } from './providers/cv.providers';
import { DatabaseModule } from '@/databases/database.module';
import { CvController } from './cv.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [
        CvController
    ],
    providers: [
        ...cvProviders,
        CvService,
    ],
})
export class CvModule { }